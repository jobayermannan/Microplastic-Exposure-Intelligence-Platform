from sqlalchemy.orm import Session
from app.models.research_entry import ResearchEntry
from app.services.embedding_service import embed_text

STOP_WORDS = {
    "are", "the", "and", "found", "what", "how", "does", "with", "from", "into",
    "for", "can", "you", "tell", "about", "there", "any", "have", "has", "been",
    "show", "find", "level", "levels", "study", "studies", "research",
}


def search_similar_entries(db: Session, query: str, top_k: int = 5):
    words = [
        w for w in query.lower().replace("?", " ").replace(",", " ").split()
        if len(w) >= 2 and w not in STOP_WORDS
    ]
    if not words:
        return []

    distance_col = ResearchEntry.embedding.cosine_distance(embed_text(query)).label("distance")
    rows = (
        db.query(ResearchEntry, distance_col)
        .order_by(distance_col)
        .limit(top_k * 2)
        .all()
    )

    filtered = []
    for entry, dist in rows:
        blob = f"{entry.product_name} {entry.microplastic_type} {entry.location or ''} {entry.detection_method or ''}".lower()
        keyword_hit = any(w in blob for w in words if len(w) >= 3)
        # Keep only entries with strong semantic similarity (cosine distance < 0.62) or direct keyword match
        if keyword_hit or (dist is not None and dist < 0.62):
            filtered.append(entry)
        if len(filtered) >= top_k:
            break

    return filtered
