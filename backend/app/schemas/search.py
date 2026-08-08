from pydantic import BaseModel
from typing import List


class SourceItem(BaseModel):
    product_name: str
    microplastic_type: str
    location: str | None
    publication_link: str | None


class SearchResponse(BaseModel):
    answer: str
    sources: List[SourceItem]
