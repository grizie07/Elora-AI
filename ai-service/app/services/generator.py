"""
Local LLM answer generator using Flan-T5-Base.
No API key required — model runs on CPU, downloaded once (~990 MB).

Optimized prompt for T5's 512-token context window.
"""
from transformers import T5ForConditionalGeneration, T5Tokenizer
import logging
import re

logger = logging.getLogger(__name__)

_model = None
_tokenizer = None

MODEL_NAME = "google/flan-t5-base"


def _load_model():
    global _model, _tokenizer
    if _model is None:
        logger.info("Loading %s …", MODEL_NAME)
        _tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
        _model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)
        logger.info("Model loaded successfully.")
    return _model, _tokenizer


def _clean_context(text: str, max_chars: int = 1200) -> str:
    """Extract the most information-dense portion of context."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:max_chars]


def generate_answer(question: str, context: str, subject: str = "") -> str:
    """Generate a natural answer to `question` given `context` from study notes."""
    model, tokenizer = _load_model()

    # Keep context short enough for T5's 512 token limit
    clean_ctx = _clean_context(context, max_chars=900)

    prompt = (
        f"Answer the question using the context below.\n\n"
        f"Context: {clean_ctx}\n\n"
        f"Question: {question}\n"
        f"Answer:"
    )

    inputs = tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)

    outputs = model.generate(
        **inputs,
        max_new_tokens=200,
        num_beams=4,
        early_stopping=True,
        no_repeat_ngram_size=3,
        length_penalty=1.5,
    )

    answer = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

    # Quality check — reject very short or generic answers
    if not answer or len(answer) < 15:
        return ""

    # Reject if it's just echoing the question or a single word
    if answer.lower().strip(".!? ") in question.lower():
        return ""

    return answer
