from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class ResearchCreate(BaseModel):
    product_name: str
    microplastic_type: str
    concentration: Optional[float] = None
    detection_method: Optional[str] = None
    publication_link: Optional[str] = None
    location: Optional[str] = None


class ResearchResponse(BaseModel):
    id: UUID
    product_name: str
    microplastic_type: str
    concentration: Optional[float]
    detection_method: Optional[str]
    publication_link: Optional[str]
    location: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
