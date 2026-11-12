from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.predict import router as predict_router
from app.api.auth import router as auth_router
from app.api.research import router as research_router
from app.api.search import router as search_router
from sqlalchemy import text
from app.core.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.research_entry import ResearchEntry
from app.services.embedding_service import get_model

app = FastAPI(title="Depthline API")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://microplastic-exposure-intelligence-swart.vercel.app",
    "https://microplastic-exposure-intelligence.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)
app.include_router(auth_router)
app.include_router(research_router)
app.include_router(search_router)

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("startup")

@app.on_event("startup")
def on_startup():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified/created successfully.")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
    try:
        get_model()
        logger.info("FastEmbed ONNX model pre-warmed successfully.")
    except Exception as e:
        logger.error(f"FastEmbed pre-warm failed: {e}")

@app.get("/health")
async def health():
    db_status = "ok"
    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
        get_model()
    except Exception:
        db_status = "degraded"
    return {"status": "ok", "database": db_status}
