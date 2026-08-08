from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.predict import router as predict_router
from app.api.auth import router as auth_router
from app.api.research import router as research_router
from app.api.search import router as search_router
from app.core.database import Base, engine
from app.models.user import User
from app.models.research_entry import ResearchEntry

app = FastAPI(title="Depthline API")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)
app.include_router(auth_router)
app.include_router(research_router)
app.include_router(search_router)
Base.metadata.create_all(bind=engine)

@app.get("/health")
async def health():
    return {"status": "ok"}
