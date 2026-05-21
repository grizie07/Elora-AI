from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import numpy as np
import json
from pathlib import Path

from app.services.ingestion import ingest_material
from app.schemas.chat import ChatAskRequest, ChatAskResponse, CitationItem
from app.services.vector_store import load_material_vectors, embed_query, cosine_similarity
from app.services.generator import generate_answer

load_dotenv()

app = FastAPI(title="AI Study Assistant AI Service")

class MaterialIngestRequest(BaseModel):
    materialId: str
    filePath: str
    title: str
    subject: str = ""
    chapter: str = ""
    topic: str = ""

class FlashcardGenerateRequest(BaseModel):
    materialId: str

@app.get("/")
def root():
    return {"success": True, "message": "AI service is running"}

@app.get("/health")
def health_check():
    return {"success": True, "message": "AI service healthy"}

@app.post("/materials/ingest")
def ingest_material_endpoint(payload: MaterialIngestRequest):
    try:
        result = ingest_material(
            material_id=payload.materialId,
            file_path=payload.filePath,
            title=payload.title,
            subject=payload.subject,
            chapter=payload.chapter,
            topic=payload.topic,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/flashcards/generate")
def generate_flashcards_endpoint(payload: FlashcardGenerateRequest):
    """Generate flashcard Q&A pairs from processed material chunks."""
    try:
        processed_file = Path("data/processed") / f"{payload.materialId}.json"
        if not processed_file.exists():
            raise HTTPException(status_code=404, detail="Processed material not found. Re-ingest first.")

        data = json.loads(processed_file.read_text(encoding="utf-8"))
        chunks = data.get("chunks", [])

        flashcards = []
        for chunk in chunks:
            text = chunk.get("text", "").strip()
            if not text or len(text) < 40:
                continue

            sentences = [s.strip() for s in text.replace("\n", " ").split(".") if len(s.strip()) > 20]
            if not sentences:
                continue

            for sentence in sentences[:3]:
                lower = sentence.lower()
                for pattern in [" is ", " are ", " refers to ", " means ", " defined as "]:
                    if pattern in lower:
                        idx = lower.index(pattern)
                        subject_part = sentence[:idx].strip().lstrip("A").lstrip("The").strip()
                        answer_part = sentence[idx + len(pattern):].strip()
                        if subject_part and answer_part and len(subject_part) < 80:
                            flashcards.append({
                                "question": f"What {pattern.strip()} {subject_part}?",
                                "answer": answer_part[:400],
                                "difficulty": "medium",
                            })
                            break

            if sentences:
                first = sentences[0]
                rest = ". ".join(sentences[1:4]) if len(sentences) > 1 else first
                flashcards.append({
                    "question": f"Explain: \"{first[:120]}\"",
                    "answer": rest[:500] if rest else first,
                    "difficulty": "easy" if len(text) < 200 else "hard",
                })

        seen = set()
        unique = []
        for fc in flashcards:
            key = fc["question"][:60]
            if key not in seen:
                seen.add(key)
                unique.append(fc)

        return {"success": True, "flashcards": unique[:40], "total": len(unique)}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def retrieve_relevant_chunks(query: str, material_ids: list[str], top_k: int = 5):
    query_embedding = embed_query(query)
    scored = []

    for material_id in material_ids:
        vector_payload = load_material_vectors(material_id)
        if not vector_payload:
            continue

        for item in vector_payload.get("vectors", []):
            chunk_embedding = np.array(item["embedding"], dtype=float)
            score = cosine_similarity(query_embedding, chunk_embedding)

            scored.append({
                "score": score,
                "materialId": vector_payload["materialId"],
                "title": vector_payload.get("title", ""),
                "subject": vector_payload.get("subject", ""),
                "topic": vector_payload.get("topic", ""),
                "chunkId": item["chunkId"],
                "text": item["text"],
            })

    scored.sort(key=lambda item: item["score"], reverse=True)

    # Content-based deduplication: reject chunks with >60% word overlap
    deduped = []
    for s in scored:
        words_s = set(s["text"].lower().split())
        is_dup = False
        for d in deduped:
            words_d = set(d["text"].lower().split())
            overlap = len(words_s & words_d) / max(len(words_s | words_d), 1)
            if overlap > 0.6:
                is_dup = True
                break
        if not is_dup:
            deduped.append(s)
    return deduped[:top_k]


def build_grounded_answer(query: str, retrieved_chunks: list[dict], subject: str = "") -> str:
    """Use LLM to generate a real answer, with smart fallback."""
    import re

    if not retrieved_chunks:
        return (
            "I couldn't find relevant information in your study materials for that question.\n\n"
            "**Suggestions:**\n"
            "• Upload more notes on this topic\n"
            "• Try rephrasing your question\n"
            "• Make sure the right materials are linked to this chat"
        )

    # Build merged context
    context_parts = [chunk["text"].strip() for chunk in retrieved_chunks]
    merged_context = "\n\n".join(context_parts)

    # Collect source names (deduplicated)
    sources = list(dict.fromkeys(
        chunk.get("title") or chunk.get("subject") or "Material"
        for chunk in retrieved_chunks
    ))
    source_line = f"\n\n📚 *Source: {', '.join(sources)}*"

    # --- Try LLM first ---
    try:
        llm_answer = generate_answer(query, merged_context, subject)
        if llm_answer and len(llm_answer) >= 15:
            return f"{llm_answer}{source_line}"
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning("LLM failed: %s", e)

    # --- Smart template fallback ---
    # Extract all sentences from chunks
    all_sentences = []
    for chunk in retrieved_chunks:
        raw = re.split(r'(?<=[.!?])\s+', chunk["text"].replace("\n", " ").strip())
        for s in raw:
            s = s.strip()
            if len(s) > 20:
                all_sentences.append(s)

    # Deduplicate sentences (>65% word overlap = duplicate)
    unique = []
    for s in all_sentences:
        words = set(s.lower().split())
        dup = False
        for u in unique:
            uw = set(u.lower().split())
            if len(words & uw) / max(len(words | uw), 1) > 0.65:
                dup = True
                break
        if not dup:
            unique.append(s)

    if not unique:
        return f"I found related material but couldn't extract a clear answer. Try rephrasing your question.{source_line}"

    # Detect question type from query
    q = query.lower().strip().rstrip("?")
    query_words = set(q.split()) - {"a", "an", "the", "is", "are", "can", "do", "does", "what", "when", "where", "how", "why", "i", "you", "we", "it", "of", "in", "for", "to"}

    # Score sentences by keyword overlap
    def score(sentence):
        sw = set(sentence.lower().split())
        return len(query_words & sw) / max(len(query_words), 1)

    unique.sort(key=score, reverse=True)

    # Pick the best sentences based on question type
    top = unique[:6]

    # Build intro based on question type
    topic = " ".join(w.capitalize() for w in query_words if len(w) > 2)[:50] or "this topic"

    if any(q.startswith(w) for w in ["what is", "what are", "define", "explain"]):
        intro = f"**Here's what your notes say about {topic}:**"
    elif any(q.startswith(w) for w in ["when", "where"]):
        intro = f"**Based on your notes, here's when/where {topic} applies:**"
    elif any(q.startswith(w) for w in ["is ", "are ", "does ", "do ", "can "]):
        intro = f"**Based on your study materials:**"
    elif q.startswith("how"):
        intro = f"**Here's how {topic} works according to your notes:**"
    elif q.startswith("why"):
        intro = f"**Here's why, according to your notes:**"
    else:
        intro = f"**From your study materials on {topic}:**"

    lines = [intro, ""]

    for s in top:
        s_clean = s.rstrip(".")
        lines.append(f"• {s_clean}.")

    lines.append(source_line)
    return "\n".join(lines)


@app.post("/chat/ask", response_model=ChatAskResponse)
def ask_chat(payload: ChatAskRequest):
    try:
        retrieved_chunks = retrieve_relevant_chunks(
            query=payload.query,
            material_ids=payload.materialIds,
            top_k=4,
        )

        answer = build_grounded_answer(
            payload.query,
            retrieved_chunks,
            subject=payload.subject,
        )

        citations = [
            CitationItem(
                materialId=chunk["materialId"],
                chunkId=chunk["chunkId"],
                excerpt=chunk["text"][:220]
            )
            for chunk in retrieved_chunks
        ]

        return ChatAskResponse(
            success=True,
            answer=answer,
            citations=citations,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
