"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

interface PredictResult {
  predicted_concentration: number;
  risk_level: "Low" | "Medium" | "High";
  unit: string;
}

interface FieldErrors {
  latitude?: string;
  longitude?: string;
  date?: string;
}

export default function Predict() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (latitude.trim() === "") {
      errors.latitude = "Latitude is required.";
    } else {
      const lat = parseFloat(latitude);
      if (isNaN(lat)) errors.latitude = "Must be a number.";
      else if (lat < -90 || lat > 90) errors.latitude = "Must be between -90 and 90.";
    }

    if (longitude.trim() === "") {
      errors.longitude = "Longitude is required.";
    } else {
      const lon = parseFloat(longitude);
      if (isNaN(lon)) errors.longitude = "Must be a number.";
      else if (lon < -180 || lon > 180) errors.longitude = "Must be between -180 and 180.";
    }

    if (date.trim() === "") {
      errors.date = "Date is required.";
    } else if (isNaN(Date.parse(date))) {
      errors.date = "Enter a valid date.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handlePredict(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    setResult(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post("/predict", {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        date,
      });
      setResult(res.data);
    } catch (err) {
      setApiError(getErrorMessage(err, "Prediction failed. Check your inputs and try again."));
    } finally {
      setLoading(false);
    }
  }

  const riskClass =
    result?.risk_level === "High" ? "risk-badge-high" :
    result?.risk_level === "Medium" ? "risk-badge-medium" : "risk-badge-low";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl font-bold text-ink mb-2">Predict exposure risk.</h1>
        <p className="text-ink-muted font-body">
          Enter a coordinate and date — the model estimates concentration and risk tier from historical ocean data.
        </p>
      </div>

      <form onSubmit={handlePredict} className="panel p-6 grid gap-4 max-w-md" noValidate>
        <div>
          <label className="font-mono text-xs text-ink-muted uppercase tracking-wide">Latitude</label>
          <input
            className={`input-field mt-1 ${fieldErrors.latitude ? "ring-2 ring-risk-high/60 border-risk-high/60" : ""}`}
            type="text" inputMode="decimal"
            placeholder="-90 to 90"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          {fieldErrors.latitude && <p className="text-risk-high font-mono text-xs mt-1">{fieldErrors.latitude}</p>}
        </div>

        <div>
          <label className="font-mono text-xs text-ink-muted uppercase tracking-wide">Longitude</label>
          <input
            className={`input-field mt-1 ${fieldErrors.longitude ? "ring-2 ring-risk-high/60 border-risk-high/60" : ""}`}
            type="text" inputMode="decimal"
            placeholder="-180 to 180"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
          {fieldErrors.longitude && <p className="text-risk-high font-mono text-xs mt-1">{fieldErrors.longitude}</p>}
        </div>

        <div>
          <label className="font-mono text-xs text-ink-muted uppercase tracking-wide">Date</label>
          <input
            className={`input-field mt-1 ${fieldErrors.date ? "ring-2 ring-risk-high/60 border-risk-high/60" : ""}`}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {fieldErrors.date && <p className="text-risk-high font-mono text-xs mt-1">{fieldErrors.date}</p>}
        </div>

        <button className="btn-primary mt-2" disabled={loading}>
          {loading ? "Predicting…" : "Run prediction"}
        </button>
      </form>

      {apiError && (
        <div className="panel p-4 max-w-md border-risk-high/30">
          <p className="text-risk-high font-mono text-sm">{apiError}</p>
        </div>
      )}

      {result && (
        <div className="panel p-6 max-w-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ink-muted uppercase tracking-wide">Risk level</span>
            <span className={`risk-badge ${riskClass}`}>{result.risk_level}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ink-muted uppercase tracking-wide">Predicted concentration</span>
            <span className="font-mono text-ink text-lg">
              {result.predicted_concentration} <span className="text-ink-muted text-sm">{result.unit}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
