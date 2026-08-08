from fastapi import FastAPI
from app.api.predict import router as predict_router
from app.api.auth import router as auth_router
from app.core.database import Base, engine
from app.models.user import User

app = FastAPI()
app.include_router(predict_router)
app.include_router(auth_router)
Base.metadata.create_all(bind=engine)

@app.get("/health")
async def health():
    return {"status": "ok"}
