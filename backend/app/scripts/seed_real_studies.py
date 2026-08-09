import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
from app.core.database import SessionLocal
from app.models.user import User
from app.models.research_entry import ResearchEntry
from app.services.embedding_service import embed_text

ENTRIES = [
    {
        "product_name": "Bottled water (multi-brand average)",
        "microplastic_type": "PET / polypropylene fragments",
        "concentration": 325.0,
        "detection_method": "Nile Red staining + FTIR spectroscopy",
        "publication_link": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6141690/",
        "location": "USA, multi-brand retail samples",
    },
    {
        "product_name": "Bottled water (nanoplastic-level analysis)",
        "microplastic_type": "PET / polyamide nanoplastics",
        "concentration": 240000.0,
        "detection_method": "Stimulated Raman Scattering (SRS) microscopy",
        "publication_link": "https://www.rutgers.edu/news/whats-your-bottled-water-study-suggests-there-may-be-hundreds-thousands-tiny-plastic-bits",
        "location": "USA, 3 popular brands",
    },
    {
        "product_name": "Sea salt (European brands)",
        "microplastic_type": "Mixed fragments and fibers",
        "concentration": 466.0,
        "detection_method": "H2O2 digestion + Raman spectroscopy",
        "publication_link": "https://www.sciencedirect.com/science/article/pii/S0147651323002865",
        "location": "13 European sea salt brands",
    },
    {
        "product_name": "Sea salt (Chinese brands)",
        "microplastic_type": "Fragments and fibers",
        "concentration": 615.0,
        "detection_method": "Lab extraction and polymer identification",
        "publication_link": "https://pubs.acs.org/doi/10.1021/acs.est.5b03163",
        "location": "China, 15 salt brands",
    },
    {
        "product_name": "Mussels (average European serving)",
        "microplastic_type": "Microfibers",
        "concentration": 90.0,
        "detection_method": "Dietary exposure modeling from lab sampling",
        "publication_link": "https://nutritionfacts.org/blog/microplastics-in-fish-fillets/",
        "location": "Europe, average shellfish serving",
    },
    {
        "product_name": "Canned fish (retail survey)",
        "microplastic_type": "Mixed polymers",
        "concentration": 2.4,
        "detection_method": "Retail product survey, lab analysis",
        "publication_link": "https://www.sciencedirect.com/science/article/pii/S0956713525004347",
        "location": "Germany, retail seafood products",
    },
]

def run():
    db = SessionLocal()
    for e in ENTRIES:
        text = f"{e['product_name']} | {e['microplastic_type']} | {e['location']}"
        vector = embed_text(text)
        entry = ResearchEntry(submitted_by=None, embedding=vector, **e)
        db.add(entry)
    db.commit()
    db.close()
    print(f"Seeded {len(ENTRIES)} real published research entries.")

if __name__ == "__main__":
    run()
