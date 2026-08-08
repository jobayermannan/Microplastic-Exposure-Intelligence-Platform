from fastembed import TextEmbedding

_model = None

def get_model():
    global _model
    if _model is None:
        _model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
    return _model

def embed_text(text: str) -> list:
    model = get_model()
    embeddings = list(model.embed([text]))
    return embeddings[0].tolist()

def build_entry_text(product_name, microplastic_type, detection_method, location) -> str:
    parts = [product_name, microplastic_type, detection_method or "", location or ""]
    return " | ".join([p for p in parts if p])
