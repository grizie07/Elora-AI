from pathlib import Path
import json
from datetime import datetime
from pypdf import PdfReader
from docx import Document
from app.services.vector_store import embed_texts, save_material_vectors

def extract_text_from_txt(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")

def extract_text_from_pdf(path: Path) -> str:
    reader = PdfReader(str(path))
    texts = []

    for page in reader.pages:
        page_text = page.extract_text() or ""
        if page_text.strip():
            texts.append(page_text)

    return "\n".join(texts)

def extract_text_from_docx(path: Path) -> str:
    doc = Document(str(path))
    texts = [para.text for para in doc.paragraphs if para.text.strip()]
    return "\n".join(texts)

def extract_text_from_file(file_path: str) -> str:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    suffix = path.suffix.lower()

    if suffix == ".txt":
        return extract_text_from_txt(path)

    if suffix == ".pdf":
        return extract_text_from_pdf(path)

    if suffix == ".docx":
        return extract_text_from_docx(path)

    raise ValueError("Unsupported file type")

def chunk_text(text: str, chunk_size: int = 700, overlap: int = 120):
    if not text:
        return []

    cleaned = " ".join(text.split())
    chunks = []
    start = 0
    text_length = len(cleaned)

    while start < text_length:
        end = min(start + chunk_size, text_length)
        chunk = cleaned[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end == text_length:
            break

        start = max(end - overlap, 0)

    return chunks

def save_processed_material(material_id: str, payload: dict):
    output_dir = Path("data/processed")
    output_dir.mkdir(parents=True, exist_ok=True)

    output_file = output_dir / f"{material_id}.json"
    output_file.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )

    return str(output_file)

def ingest_material(material_id: str, file_path: str, title: str, subject: str = "", chapter: str = "", topic: str = ""):
    text = extract_text_from_file(file_path)
    chunks = chunk_text(text)

    chunk_items = [
        {
            "chunkId": f"{material_id}_chunk_{index + 1}",
            "text": chunk,
        }
        for index, chunk in enumerate(chunks)
    ]

    processed_payload = {
        "materialId": material_id,
        "title": title,
        "subject": subject,
        "chapter": chapter,
        "topic": topic,
        "sourcePath": file_path,
        "textLength": len(text),
        "chunkCount": len(chunks),
        "chunks": chunk_items,
        "processedAt": datetime.utcnow().isoformat() + "Z",
    }

    saved_processed_path = save_processed_material(material_id, processed_payload)

    embeddings = embed_texts([item["text"] for item in chunk_items])

    vector_payload = {
        "materialId": material_id,
        "title": title,
        "subject": subject,
        "chapter": chapter,
        "topic": topic,
        "vectorModel": "all-MiniLM-L6-v2",
        "chunkCount": len(chunk_items),
        "vectors": [
            {
                "chunkId": chunk_items[index]["chunkId"],
                "text": chunk_items[index]["text"],
                "embedding": embeddings[index],
            }
            for index in range(len(chunk_items))
        ],
        "createdAt": datetime.utcnow().isoformat() + "Z",
    }

    saved_vector_path = save_material_vectors(material_id, vector_payload)

    return {
        "success": True,
        "message": "Material ingested successfully",
        "materialId": material_id,
        "chunkCount": len(chunks),
        "processedFile": saved_processed_path,
        "vectorFile": saved_vector_path,
    }