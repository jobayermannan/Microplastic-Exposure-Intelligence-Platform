from fastapi import APIRouter, HTTPException
from app.schemas.predict import PredictRequest, PredictResponse
from app.services.ml_service import predict as run_prediction

router = APIRouter()

@router.post("/predict", response_model=PredictResponse)
def predict_endpoint(payload: PredictRequest):
    try:
        result = run_prediction(payload.latitude, payload.longitude, payload.date)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
