import httpx
from app.core.config import settings

OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models"
OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions"

# Preferred order to try first if they're available (fast, reliable when live).
# If none of these are live, we fall back to ANY free model returned by the API.
PREFERRED_FREE_MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "qwen/qwen3-coder:free",
]

_cached_free_models = None

def get_free_model_list() -> list:
    global _cached_free_models
    if _cached_free_models is not None:
        return _cached_free_models

    try:
        response = httpx.get(OPENROUTER_MODELS_URL, timeout=15.0)
        response.raise_for_status()
        data = response.json()
        free_ids = [
            m["id"] for m in data.get("data", [])
            if m.get("pricing", {}).get("prompt") == "0"
        ]
        # Put preferred models first (if they're actually in the live list), then the rest.
        ordered = [m for m in PREFERRED_FREE_MODELS if m in free_ids]
        ordered += [m for m in free_ids if m not in ordered]
        _cached_free_models = ordered
        return ordered
    except Exception:
        return list(PREFERRED_FREE_MODELS)  # best-effort fallback if the models API itself fails


def build_context(entries) -> str:
    if not entries:
        return "No matching research entries found in the database."

    lines = []
    for i, e in enumerate(entries, 1):
        lines.append(
            f"[{i}] Product: {e.product_name} | Type: {e.microplastic_type} | "
            f"Concentration: {e.concentration} | Method: {e.detection_method} | "
            f"Location: {e.location} | Source: {e.publication_link}"
        )
    return "\n".join(lines)


def _call_model(model_id: str, system_prompt: str, user_prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    body = {
        "model": model_id,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }
    response = httpx.post(OPENROUTER_CHAT_URL, headers=headers, json=body, timeout=30.0)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]


def generate_answer(query: str, entries) -> str:
    context = build_context(entries)

    system_prompt = (
        "You are an environmental health assistant. Answer the user's question "
        "using ONLY the research entries provided below. Cite entries by their "
        "[number] when you use them. If the entries don't contain enough "
        "information to answer confidently, say so clearly instead of guessing."
    )
    user_prompt = f"Research entries:\n{context}\n\nUser question: {query}"

    if not settings.OPENROUTER_API_KEY:
        return "OpenRouter API key not configured. Set OPENROUTER_API_KEY in .env."

    candidates = get_free_model_list()
    if not candidates:
        return "No free OpenRouter models are currently available. Try again shortly."

    last_error = None
    for model_id in candidates[:5]:  # cap attempts so a bad run doesn't hang forever
        try:
            return _call_model(model_id, system_prompt, user_prompt)
        except httpx.HTTPStatusError as e:
            last_error = f"{model_id} -> {e.response.status_code}"
            continue
        except Exception as e:
            last_error = f"{model_id} -> {str(e)}"
            continue

    return f"All free models failed. Last error: {last_error}"
