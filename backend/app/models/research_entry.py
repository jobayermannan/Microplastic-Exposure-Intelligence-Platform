import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from app.core.database import Base


class ResearchEntry(Base):
    __tablename__ = "research_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submitted_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    product_name = Column(String, nullable=False)
    microplastic_type = Column(String, nullable=False)
    concentration = Column(Float, nullable=True)
    detection_method = Column(String, nullable=True)
    publication_link = Column(String, nullable=True)
    location = Column(String, nullable=True)
    embedding = Column(Vector(384), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
