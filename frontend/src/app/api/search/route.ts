import { NextRequest, NextResponse } from "next/server";

interface StudyEntry {
  product_name: string;
  microplastic_type: string;
  concentration: number;
  detection_method: string;
  location: string;
  publication_link: string;
  keywords: string[];
}

const STUDIES: StudyEntry[] = [
  {
    product_name: "Bottled water (multi-brand average)",
    microplastic_type: "PET / polypropylene fragments",
    concentration: 325.0,
    detection_method: "Nile Red staining + FTIR spectroscopy",
    location: "USA, multi-brand retail samples",
    publication_link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6141690/",
    keywords: ["bottled", "water", "pet", "polypropylene", "fragments", "drinking", "beverage", "bottle", "usa"],
  },
  {
    product_name: "Bottled water (nanoplastic-level analysis)",
    microplastic_type: "PET / polyamide nanoplastics",
    concentration: 240000.0,
    detection_method: "Stimulated Raman Scattering (SRS) microscopy",
    location: "USA, 3 popular brands",
    publication_link: "https://www.rutgers.edu/news/whats-your-bottled-water-study-suggests-there-may-be-hundreds-thousands-tiny-plastic-bits",
    keywords: ["bottled", "water", "pet", "polyamide", "nanoplastics", "nano", "drinking", "bottle", "usa"],
  },
  {
    product_name: "Municipal Wastewater Treatment Effluent",
    microplastic_type: "Polyester (PET) and acrylic microfibers",
    concentration: 12.5,
    detection_method: "Membrane filtration + micro-FTIR spectroscopy",
    location: "Secondary & tertiary WWTP effluent, North America & Europe",
    publication_link: "https://pubs.acs.org/doi/10.1021/acs.est.6b03045",
    keywords: ["polyester", "fibers", "microfibers", "wastewater", "effluent", "sewage", "treatment", "wwtp", "acrylic", "textile", "laundry", "water"],
  },
  {
    product_name: "Sea salt (Chinese brands)",
    microplastic_type: "Fragments and fibers (PET, PE, cellophane)",
    concentration: 615.0,
    detection_method: "Lab extraction and micro-FTIR polymer identification",
    location: "China, 15 retail salt brands",
    publication_link: "https://pubs.acs.org/doi/10.1021/acs.est.5b03163",
    keywords: ["salt", "table", "sea", "chinese", "china", "fragments", "fibers", "sodium", "seasoning"],
  },
  {
    product_name: "Sea salt (European brands)",
    microplastic_type: "Mixed fragments and fibers (PP, PE, PET)",
    concentration: 466.0,
    detection_method: "H2O2 digestion + Raman spectroscopy",
    location: "13 European sea salt brands",
    publication_link: "https://www.sciencedirect.com/science/article/pii/S0147651323002865",
    keywords: ["salt", "table", "sea", "european", "europe", "fragments", "fibers", "seasoning"],
  },
  {
    product_name: "Human Bloodstream (Healthy Adult Donors)",
    microplastic_type: "PET, Polystyrene (PS), and Polyethylene (PE) particles",
    concentration: 1.6,
    detection_method: "Pyrolysis-GC/MS double shot analysis",
    location: "Netherlands, Vrije Universiteit Amsterdam clinical study",
    publication_link: "https://www.sciencedirect.com/science/article/pii/S0160412022001258",
    keywords: ["human", "blood", "bloodstream", "health", "clinical", "placenta", "body", "pet", "polystyrene", "donor"],
  },
  {
    product_name: "Municipal Tap Water (Global Multi-Country Survey)",
    microplastic_type: "Synthetic microfibers (Polyester, PET, Polypropylene)",
    concentration: 4.34,
    detection_method: "Rose Bengal staining + stereomicroscopy",
    location: "Global survey across 14 countries (USA, Europe, Asia)",
    publication_link: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0194970",
    keywords: ["tap", "water", "drinking", "municipal", "fibers", "microfibers", "global"],
  },
  {
    product_name: "Plastic Mesh Tea Bags (Steeped at 95°C)",
    microplastic_type: "Nylon-6 and PET micro- and nanoplastics",
    concentration: 11600000.0,
    detection_method: "SEM, XPS, and FTIR spectroscopy",
    location: "Canada, McGill University beverage steeping analysis",
    publication_link: "https://pubs.acs.org/doi/10.1021/acs.est.9b02540",
    keywords: ["tea", "bags", "teabag", "nylon", "pet", "hot", "beverage", "steeping", "nanoplastics"],
  },
  {
    product_name: "Marine Fish — Hilsa & Bombay Duck (GI Tract)",
    microplastic_type: "Polyethylene (PE), Polypropylene (PP), and Polyester fibers",
    concentration: 18.4,
    detection_method: "KOH alkaline digestion + ATR-FTIR",
    location: "Bay of Bengal, Bangladesh coastal waters",
    publication_link: "https://www.sciencedirect.com/science/article/pii/S0025326X21005166",
    keywords: ["fish", "seafood", "marine", "hilsa", "bay", "bengal", "bangladesh", "ocean", "fibers", "polyethylene"],
  },
  {
    product_name: "Mussels (average European serving)",
    microplastic_type: "Synthetic microfibers",
    concentration: 90.0,
    detection_method: "Dietary exposure modeling from lab sampling",
    location: "Europe, average shellfish serving",
    publication_link: "https://nutritionfacts.org/blog/microplastics-in-fish-fillets/",
    keywords: ["mussels", "shellfish", "seafood", "fish", "marine", "europe", "microfibers", "ocean"],
  },
  {
    product_name: "Canned fish (retail survey)",
    microplastic_type: "Mixed polymers (PP, PE, PET)",
    concentration: 2.4,
    detection_method: "Retail product survey, lab analysis",
    location: "Germany, retail seafood products",
    publication_link: "https://www.sciencedirect.com/science/article/pii/S0956713525004347",
    keywords: ["canned", "fish", "seafood", "tuna", "germany", "retail", "marine"],
  },
  {
    product_name: "Dhaka River System Water (Buriganga & Turag Surface Water)",
    microplastic_type: "Polyethylene (PE), Polypropylene (PP), Nylon",
    concentration: 3.65,
    detection_method: "Wet peroxide oxidation + FTIR spectroscopy",
    location: "Dhaka, Bangladesh",
    publication_link: "https://www.sciencedirect.com/science/article/pii/S0048969721034525",
    keywords: ["dhaka", "river", "buriganga", "turag", "bangladesh", "water", "surface", "nylon"],
  },
  {
    product_name: "Commercial Toothpaste Brands (Bangladesh Market)",
    microplastic_type: "Polyethylene (PE) Microbeads / Synthetic Polymers",
    concentration: 320.0,
    detection_method: "Filtration + FTIR spectroscopy",
    location: "Dhaka, Bangladesh",
    publication_link: "https://www.sciencedirect.com/science/article/pii/S266676572200045X",
    keywords: ["toothpaste", "cosmetics", "microbeads", "personal", "care", "bangladesh", "dhaka", "polyethylene"],
  },
];

function rankStudies(query: string, topK = 5): StudyEntry[] {
  const qLower = query.toLowerCase();
  const tokens = qLower
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !["are", "the", "and", "found", "what", "how", "does", "with", "from", "into"].includes(w));

  const scored = STUDIES.map((s) => {
    let score = 0;
    const fullText = `${s.product_name} ${s.microplastic_type} ${s.location} ${s.detection_method} ${s.keywords.join(" ")}`.toLowerCase();
    for (const t of tokens) {
      if (s.product_name.toLowerCase().includes(t)) score += 6;
      if (s.microplastic_type.toLowerCase().includes(t)) score += 5;
      if (s.keywords.some((k) => k.includes(t) || t.includes(k))) score += 4;
      if (fullText.includes(t)) score += 2;
    }
    return { study: s, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((x) => x.study);
}

function buildGroundedAnswer(query: string, topStudies: StudyEntry[]): string {
  const qLower = query.toLowerCase();
  const tokens = qLower
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !["are", "the", "and", "found", "what", "how", "does", "with", "from", "into"].includes(w));

  const matching = topStudies
    .map((s, idx) => ({ s, idx: idx + 1 }))
    .filter(({ s }) => {
      const blob = `${s.product_name} ${s.microplastic_type} ${s.location} ${s.keywords.join(" ")}`.toLowerCase();
      return tokens.length === 0 || tokens.some((t) => blob.includes(t));
    });

  const selected = matching.length > 0 ? matching.slice(0, 4) : topStudies.slice(0, 3).map((s, i) => ({ s, idx: i + 1 }));

  const bullets = selected.map(
    ({ s, idx }) =>
      `• ${s.product_name} (${s.location}): Detected ${s.microplastic_type} at a mean concentration of ${s.concentration.toLocaleString()} using ${s.detection_method} [${idx}].`
  );

  if (matching.length > 0) {
    return `Yes — peer-reviewed studies in the Depthline research database confirm findings related to "${query}":\n\n${bullets.join("\n")}`;
  }
  return `Here are the closest peer-reviewed microplastic exposure studies in the Depthline database related to "${query}":\n\n${bullets.join("\n")}`;
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 1) {
    return NextResponse.json({ detail: "Query parameter 'q' is required." }, { status: 400 });
  }

  const topStudies = rankStudies(q, 5);
  const answer = buildGroundedAnswer(q, topStudies);
  const sources = topStudies.map((s) => ({
    product_name: s.product_name,
    microplastic_type: s.microplastic_type,
    location: s.location,
    publication_link: s.publication_link,
  }));

  return NextResponse.json({ answer, sources });
}
