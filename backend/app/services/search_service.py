from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.research_entry import ResearchEntry
from app.services.embedding_service import embed_text


def search_similar_entries(db: Session, query: str, top_k: int = 5):
    query_vector = embed_text(query)
    results = (
        db.query(ResearchEntry)
        .order_by(ResearchEntry.embedding.cosine_distance(query_vector))
        .limit(top_k)
        .all()
    )
    return results
