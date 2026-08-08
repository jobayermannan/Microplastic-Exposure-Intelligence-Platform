import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import r2_score, mean_absolute_error, accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
import pickle
import os

# ---------- 1. Load data ----------
df = pd.read_csv("data/SEA_MICRO.csv")
print("Raw shape:", df.shape)

# ---------- 2. Clean ----------
df = df.dropna(subset=["Latitude", "Longitude", "Pieces_KM2", "Date"])
df["Pieces_KM2"] = pd.to_numeric(df["Pieces_KM2"], errors="coerce")
df = df.dropna(subset=["Pieces_KM2"])
df = df[df["Pieces_KM2"] >= 0]

# ---------- 3. Feature engineering ----------
df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
df = df.dropna(subset=["Date"])
df["Month"] = df["Date"].dt.month

def month_to_season(m):
    if m in [12, 1, 2]:
        return 0  # Winter
    elif m in [3, 4, 5]:
        return 1  # Spring
    elif m in [6, 7, 8]:
        return 2  # Summer
    else:
        return 3  # Autumn

df["Season"] = df["Month"].apply(month_to_season)

# ---------- 4. Create risk tier target (classification label) ----------
# Bin concentration into 3 tiers using quantiles (33rd/66th percentile cut points)
quantiles = df["Pieces_KM2"].quantile([0.33, 0.66]).values
def to_risk(val):
    if val <= quantiles[0]:
        return "Low"
    elif val <= quantiles[1]:
        return "Medium"
    else:
        return "High"

df["Risk_Level"] = df["Pieces_KM2"].apply(to_risk)
print("Risk tier distribution:\n", df["Risk_Level"].value_counts())

# ---------- 5. Features / targets ----------
FEATURES = ["Latitude", "Longitude", "Month", "Season"]
X = df[FEATURES]
y_reg = df["Pieces_KM2"]
y_reg_log = np.log1p(y_reg)  # log-transform to tame extreme outliers

le = LabelEncoder()
y_clf = le.fit_transform(df["Risk_Level"])  # Low=?, Medium=?, High=? -> check le.classes_

# ---------- 6. Train/test split (same split reused for both models) ----------
X_train, X_test, yreg_train_raw, yreg_test_raw, yreg_train_log, yreg_test_log, yclf_train, yclf_test = train_test_split(
    X, y_reg, y_reg_log, y_clf, test_size=0.2, random_state=42
)

# ---------- 7. Train regression model (on log-transformed target) ----------
reg_model = RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1)
reg_model.fit(X_train, yreg_train_log)
reg_preds_log = reg_model.predict(X_test)
reg_preds = np.expm1(reg_preds_log)  # convert back to real concentration units
print("\n--- Regression Results (predicting concentration) ---")
print("R2 score (log scale):", r2_score(yreg_test_log, reg_preds_log))
print("R2 score (original scale):", r2_score(yreg_test_raw, reg_preds))
print("MAE (original scale):", mean_absolute_error(yreg_test_raw, reg_preds))

# ---------- 8. Train classification model ----------
clf_model = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1)
clf_model.fit(X_train, yclf_train)
clf_preds = clf_model.predict(X_test)
print("\n--- Classification Results (predicting risk tier) ---")
print("Accuracy:", accuracy_score(yclf_test, clf_preds))
print("Classes (in order):", le.classes_)
print(classification_report(yclf_test, clf_preds, target_names=le.classes_))

# ---------- 9. Save models ----------
os.makedirs("../backend/app/models", exist_ok=True)
with open("../backend/app/models/regressor.pkl", "wb") as f:
    pickle.dump(reg_model, f)
with open("../backend/app/models/classifier.pkl", "wb") as f:
    pickle.dump(clf_model, f)
with open("../backend/app/models/label_encoder.pkl", "wb") as f:
    pickle.dump(le, f)

print("\nModels saved to backend/app/models/")
