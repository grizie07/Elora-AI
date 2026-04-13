from pydantic import BaseModel, Field
from typing import List, Optional

class CitationItem(BaseModel):
    materialId: str
    chunkId: str
    excerpt: str

class ChatAskRequest(BaseModel):
    query: str = Field(..., min_length=1)
    materialIds: List[str] = []
    subject: Optional[str] = ""
    topic: Optional[str] = ""

class ChatAskResponse(BaseModel):
    success: bool
    answer: str
    citations: List[CitationItem]