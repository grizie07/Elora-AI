from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import numpy as np

from app.services.ingestion import ingest_material
from app.schemas.chat import ChatAskRequest, ChatAskResponse, CitationItem
from app.services.vector_store import load_material_vectors, embed_query, cosine_similarity

load_dotenv()

app = FastAPI(title="AI Study Assistant AI Service")

class MaterialIngestRequest(BaseModel):
    materialId: str
    filePath: str
    title: str
    subject: str = ""
    chapter: str = ""
    topic: str = ""

@app.get("/")
def root():
    return {
        "success": True,
        "message": "AI service is running"
    }

@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "AI service healthy"
    }

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

def retrieve_relevant_chunks(query: str, material_ids: list[str], top_k: int = 3):
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
                "chunkId": item["chunkId"],
                "text": item["text"],
            })

    scored.sort(key=lambda item: item["score"], reverse=True)
    return scored[:top_k]

def build_grounded_answer(query: str, retrieved_chunks: list[dict]) -> str:
    if not retrieved_chunks:
        return (
            "I could not find relevant information in the selected study materials. "
            "Try uploading more specific notes or asking about a topic covered in your materials."
        )

    answer_parts = [
        "Based on the most relevant parts of your uploaded study materials:"
    ]

    for index, chunk in enumerate(retrieved_chunks, start=1):
        answer_parts.append(f"{index}. {chunk['text']}")

    answer_parts.append(
        "This response is grounded in semantically retrieved study material chunks."
    )

    return "\n\n".join(answer_parts)

@app.post("/chat/ask", response_model=ChatAskResponse)
def ask_chat(payload: ChatAskRequest):
    try:
        retrieved_chunks = retrieve_relevant_chunks(
            query=payload.query,
            material_ids=payload.materialIds,
            top_k=3,
        )

        answer = build_grounded_answer(payload.query, retrieved_chunks)

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