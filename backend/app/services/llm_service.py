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


def _synthesize_fallback_answer(query: str, entries) -> str:
    if not entries:
        return "No matching research entries were found in the database for your query."

    q_words = [w.lower() for w in query.replace("?", " ").replace(",", " ").split() if len(w) > 2]
    matched = []
    for i, e in enumerate(entries, 1):
        blob = f"{e.product_name} {e.microplastic_type} {e.location or ''} {e.detection_method or ''}".lower()
        if any(w in blob for w in q_words):
            matched.append((i, e))

    target = matched if matched else [(i, e) for i, e in enumerate(entries[:3], 1)]
    parts = []
    for idx, e in target[:4]:
        conc = f" at a reported concentration of {e.concentration}" if e.concentration is not None else ""
        loc = f" ({e.location})" if e.location else ""
        method = f" detected via {e.detection_method}" if e.detection_method else ""
        parts.append(f"• {e.product_name}{loc}: {e.microplastic_type}{conc}{method} [{idx}].")

    header = (
        f"Based on the peer-reviewed studies in the Depthline database matching \"{query}\":"
        if matched
        else f"Closest peer-reviewed findings in the Depthline database related to \"{query}\":"
    )
    return header + "\n\n" + "\n".join(parts)


def generate_answer(query: str, entries) -> str:
    if not entries:
        return "No matching research entries found in the database."

    context = build_context(entries)

    system_prompt = (
        "You are an environmental health research assistant for Depthline. Answer the user's "
        "question clearly and concisely using ONLY the research entries provided below. "
        "If the user types a short keyword or topic (e.g., 'seafood', 'water', 'salt', 'wastewater'), "
        "summarize all relevant findings from the provided entries. Always cite entries by their "
        "[number] (e.g., [1], [2]). Keep the tone scientific, helpful, and direct."
    )
    user_prompt = f"Research entries:\n{context}\n\nUser query: {query}"

    if not settings.OPENROUTER_API_KEY:
        return _synthesize_fallback_answer(query, entries)

    candidates = get_free_model_list()
    if not candidates:
        return _synthesize_fallback_answer(query, entries)

    for model_id in candidates[:3]:
        try:
            return _call_model(model_id, system_prompt, user_prompt)
        except Exception:
            continue

    return _synthesize_fallback_answer(query, entries)
