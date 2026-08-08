from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    date: str = Field(..., description="Date in YYYY-MM-DD format")

class PredictResponse(BaseModel):
    predicted_concentration: float
    risk_level: str
    unit: str = "pieces/km2"
