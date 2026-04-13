from pathlib import Path
import json
import numpy as np
from sentence_transformers import SentenceTransformer

MODEL_NAME = "all-MiniLM-L6-v2"

_model = None

def get_embedding_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model

def embed_texts(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []

    model = get_embedding_model()
    embeddings = model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
    return embeddings.tolist()

def embed_query(text: str) -> np.ndarray:
    model = get_embedding_model()
    embedding = model.encode([text], convert_to_numpy=True, normalize_embeddings=True)[0]
    return embedding

def save_material_vectors(material_id: str, payload: dict):
    vector_dir = Path("data/vector_store")
    vector_dir.mkdir(parents=True, exist_ok=True)

    output_file = vector_dir / f"{material_id}.json"
    output_file.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )

    return str(output_file)

def load_material_vectors(material_id: str):
    file_path = Path("data/vector_store") / f"{material_id}.json"
    if not file_path.exists():
        return None

    return json.loads(file_path.read_text(encoding="utf-8"))

def cosine_similarity(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
    return float(np.dot(vec_a, vec_b))