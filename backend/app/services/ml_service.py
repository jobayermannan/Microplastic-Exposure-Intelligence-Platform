import pickle
import numpy as np
from datetime import datetime
from pathlib import Path

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"

with open(MODELS_DIR / "regressor.pkl", "rb") as f:
    reg_model = pickle.load(f)

with open(MODELS_DIR / "classifier.pkl", "rb") as f:
    clf_model = pickle.load(f)

with open(MODELS_DIR / "label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)


def _month_to_season(month: int) -> int:
    if month in [12, 1, 2]:
        return 0
    elif month in [3, 4, 5]:
        return 1
    elif month in [6, 7, 8]:
        return 2
    else:
        return 3


def predict(latitude: float, longitude: float, date_str: str) -> dict:
    parsed_date = datetime.strptime(date_str, "%Y-%m-%d")
    month = parsed_date.month
    season = _month_to_season(month)

    features = np.array([[latitude, longitude, month, season]])

    log_concentration = reg_model.predict(features)[0]
    concentration = float(np.expm1(log_concentration))
    concentration = max(0.0, concentration)  # guard against tiny negative noise

    risk_encoded = clf_model.predict(features)[0]
    risk_label = label_encoder.inverse_transform([risk_encoded])[0]

    return {
        "predicted_concentration": round(concentration, 2),
        "risk_level": risk_label,
        "unit": "pieces/km2",
    }
