from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.research_entry import ResearchEntry
from app.schemas.research import ResearchCreate, ResearchResponse
from app.services.embedding_service import embed_text, build_entry_text

router = APIRouter()


@router.post("/research", response_model=ResearchResponse)
def create_research_entry(
    payload: ResearchCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    text = build_entry_text(
        payload.product_name, payload.microplastic_type,
        payload.detection_method, payload.location
    )
    vector = embed_text(text)

    entry = ResearchEntry(
        submitted_by=current_user["sub"],
        product_name=payload.product_name,
        microplastic_type=payload.microplastic_type,
        concentration=payload.concentration,
        detection_method=payload.detection_method,
        publication_link=payload.publication_link,
        location=payload.location,
        embedding=vector,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/research", response_model=List[ResearchResponse])
def list_research_entries(db: Session = Depends(get_db)):
    return db.query(ResearchEntry).order_by(ResearchEntry.created_at.desc()).all()
