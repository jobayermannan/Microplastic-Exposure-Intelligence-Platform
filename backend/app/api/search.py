from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.search_service import search_similar_entries
from app.services.llm_service import generate_answer
from app.schemas.search import SearchResponse

router = APIRouter()


@router.get("/search", response_model=SearchResponse)
def search(q: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    entries = search_similar_entries(db, q, top_k=5)
    answer = generate_answer(q, entries)

    sources = [
        {
            "product_name": e.product_name,
            "microplastic_type": e.microplastic_type,
            "location": e.location,
            "publication_link": e.publication_link,
        }
        for e in entries
    ]

    return {"answer": answer, "sources": sources}
