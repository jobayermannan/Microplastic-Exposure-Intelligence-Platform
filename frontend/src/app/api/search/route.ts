import { NextRequest, NextResponse } from "next/server";

interface StudyEntry {
  product_name: string;
  microplastic_type: string;
  concentration: number;
  unit: string;
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
    unit: "particles/L",
    detection_method: "Nile Red staining + FTIR spectroscopy",
    location: "USA, multi-brand retail samples",
    publication_link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6141690/",
    keywords: ["bottled", "water", "pet", "polyethylene", "terephthalate", "polypropylene", "pp", "fragments", "drinking", "beverage", "bottle", "usa"],
  },
  {
    product_name: "Bottled water (nanoplastic-level analysis)",
    microplastic_type: "PET / polyamide nanoplastics",
    concentration: 240000.0,
    unit: "particles/L",
    detection_method: "Stimulated Raman Scattering (SRS) microscopy",
    location: "USA, 3 popular brands",
    publication_link: "https://www.rutgers.edu/news/whats-your-bottled-water-study-suggests-there-may-be-hundreds-thousands-tiny-plastic-bits",
    keywords: ["bottled", "water", "pet", "polyamide", "nylon", "nanoplastics", "nano", "drinking", "bottle", "usa"],
  },
  {
    product_name: "Municipal Wastewater Treatment Effluent",
    microplastic_type: "Polyester (PET) and acrylic microfibers",
    concentration: 12.5,
    unit: "fibers/L",
    detection_method: "Membrane filtration + micro-FTIR spectroscopy",
    location: "Secondary & tertiary WWTP effluent, North America & Europe",
    publication_link: "https://pubs.acs.org/doi/10.1021/acs.est.6b03045",
    keywords: ["polyester", "pet", "fibers", "microfibers", "wastewater", "effluent", "sewage", "treatment", "wwtp", "acrylic", "textile", "laundry"],
  },
  {
    product_name: "Sea salt (Chinese brands)",
    microplastic_type: "Fragments and fibers (PET, PE, cellophane)",
    concentration: 615.0,
    unit: "particles/kg",
    detection_method: "Lab extraction and micro-FTIR polymer identification",
    location: "China, 15 retail salt brands",
    publication_link: "https://pubs.acs.org/doi/10.1021/acs.est.5b03163",
    keywords: ["salt", "table", "sea", "chinese", "china", "fragments", "fibers", "sodium", "seasoning", "pet", "pe"],
  },
  {
    product_name: "Sea salt (European brands)",
    microplastic_type: "Mixed fragments and fibers (PP, PE, PET)",
    concentration: 466.0,
    unit: "particles/kg",
    detection_method: "H2O2 digestion + Raman spectroscopy",
    location: "13 European sea salt brands",
    publication_link: "https://www.sciencedirect.com/science/article/pii/S0147651323002865",
    keywords: ["salt", "table", "sea", "european", "europe", "fragments", "fibers", "seasoning", "pp", "pe", "pet"],
  },
  {
    product_name: "Human Bloodstream (Healthy Adult Donors)",
    microplastic_type: "PET, Polystyrene (PS), and Polyethylene (PE) particles",
    concentration: 1.6,
    unit: "µg/mL",
    detection_method: "Pyrolysis-GC/MS double shot analysis",
    location: "Netherlands, Vrije Universiteit Amsterdam clinical study",
    publication_link: "https://www.sciencedirect.com/science/article/pii/S0160412022001258",
    keywords: ["human", "blood", "bloodstream", "health", "clinical", "placenta", "body", "pet", "polystyrene", "ps", "polyethylene", "pe", "donor", "exposure"],
  },
  {
    product_name: "Municipal Tap Water (Global Multi-Country Survey)",
    microplastic_type: "Synthetic microfibers (Polyester, PET, Polypropylene)",
    concentration: 4.34,
    unit: "particles/L",
    detection_method: "Rose Bengal staining + stereomicroscopy",
    location: "Global survey across 14 countries (USA, Europe, Asia)",
    publication_link: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0194970",
    keywords: ["tap", "water", "drinking", "municipal", "fibers", "microfibers", "polyester", "pet", "polypropylene", "global"],
  },
  {
    product_name: "Plastic Mesh Tea Bags (Steeped at 95°C)",
    microplastic_type: "Nylon-6 and PET micro- and nanoplastics",
    concentration: 11600000.0,
    unit: "particles/cup",
    detection_method: "SEM, XPS, and FTIR spectroscopy",
    location: "Canada, McGill University beverage steeping analysis",
    publication_link: "https://pubs.acs.org/doi/10.1021/acs.est.9b02540",
    keywords: ["tea", "bag", "bags", "teabag", "nylon", "pet", "beverage", "steeping", "nanoplastics", "canada"],
  },
  {
    product_name: "Marine Fish — Hilsa & Bombay Duck (GI Tract)",
    microplastic_type: "Polyethylene (PE), Polypropylene (PP), and Polyester fibers",
    concentration: 18.4,
    unit: "particles/fish",
    detection_method: "KOH alkaline digestion + ATR-FTIR",
    location: "Bay of Bengal, Bangladesh coastal waters",
    publication_link: "https://www.sciencedirect.com/science/article/pii/S0025326X21005166",
    keywords: ["fish", "seafood", "marine", "hilsa", "bombay", "duck", "bay", "bengal", "bangladesh", "ocean", "fibers", "polyethylene", "pe", "pp"],
  },
  {
    product_name: "Mussels (average European serving)",
    microplastic_type: "Synthetic microfibers",
    concentration: 90.0,
    unit: "particles/serving",
    detection_method: "Dietary exposure modeling from lab sampling",
    location: "Europe, average shellfish serving",
    publication_link: "https://nutritionfacts.org/blog/microplastics-in-fish-fillets/",
    keywords: ["mussels", "shellfish", "seafood", "fish", "marine", "europe", "microfibers", "fibers", "ocean"],
  },
  {
    product_name: "Canned fish (retail survey)",
    microplastic_type: "Mixed polymers (PP, PE, PET)",
    concentration: 2.4,
    unit: "particles/100g",
    detection_method: "Retail product survey, lab analysis",
    location: "Germany, retail seafood products",
    publication_link: "https://www.sciencedirect.com/science/article/pii/S0956713525004347",
    keywords: ["canned", "fish", "seafood", "tuna", "germany", "retail", "marine", "pp", "pe", "pet"],
  },
  {
    product_name: "Dhaka River System Water (Buriganga & Turag Surface Water)",
    microplastic_type: "Polyethylene (PE), Polypropylene (PP), Nylon",
    concentration: 3.65,
    unit: "particles/L",
    detection_method: "Wet peroxide oxidation + FTIR spectroscopy",
    location: "Dhaka, Bangladesh",
    publication_link: "https://www.sciencedirect.com/science/article/pii/S0048969721034525",
    keywords: ["dhaka", "river", "buriganga", "turag", "bangladesh", "water", "surface", "nylon", "pe", "pp"],
  },
  {
    product_name: "Commercial Toothpaste Brands (Bangladesh Market)",
    microplastic_type: "Polyethylene (PE) Microbeads / Synthetic Polymers",
    concentration: 320.0,
    unit: "particles/g",
    detection_method: "Filtration + FTIR spectroscopy",
    location: "Dhaka, Bangladesh",
    publication_link: "https://www.sciencedirect.com/science/article/pii/S266676572200045X",
    keywords: ["toothpaste", "cosmetics", "microbeads", "personal", "care", "bangladesh", "dhaka", "polyethylene", "pe", "kodomo"],
  },
];

const STOP_WORDS = new Set([
  "are", "the", "and", "found", "what", "how", "does", "with", "from", "into",
  "for", "can", "you", "tell", "about", "there", "any", "have", "has", "been",
  "show", "find", "level", "levels", "study", "studies", "research",
]);

const GENERIC_WORDS = new Set([
  "microplastic", "microplastics", "plastic", "plastics", "contamination", "pollution", "polymer", "polymers",
]);

function extractTokens(query: string): { specific: string[]; generic: string[] } {
  const words = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

  const specific = words.filter((w) => !GENERIC_WORDS.has(w));
  const generic = words.filter((w) => GENERIC_WORDS.has(w));
  return { specific, generic };
}

function findMatchingStudies(query: string, maxResults = 5): StudyEntry[] {
  const { specific, generic } = extractTokens(query);

  // If the user only typed a greeting or gibberish with no specific or generic tokens
  if (specific.length === 0 && generic.length === 0) {
    return [];
  }

  // If user only typed "microplastics" or "plastic contamination" with no specific target, return diverse top studies
  if (specific.length === 0 && generic.length > 0) {
    return STUDIES.slice(0, maxResults);
  }

  const scored = STUDIES.map((s) => {
    let score = 0;
    const prodLower = s.product_name.toLowerCase();
    const typeLower = s.microplastic_type.toLowerCase();
    const locLower = s.location.toLowerCase();
    const methodLower = s.detection_method.toLowerCase();

    for (const t of specific) {
      const exactKeyword = s.keywords.some((k) => k === t || (t.length >= 3 && (k.startsWith(t) || t.startsWith(k))));
      const inProd = prodLower.includes(t);
      const inType = typeLower.includes(t);
      const inLoc = locLower.includes(t);
      const inMethod = methodLower.includes(t);

      if (inProd && t.length >= 3) score += 8;
      if (inType && t.length >= 2) score += 6;
      if (exactKeyword) score += 5;
      if (inLoc && t.length >= 3) score += 4;
      if (inMethod && t.length >= 3) score += 3;
    }

    return { study: s, score };
  });

  // Require a minimum relevance score so unrelated queries (e.g. "hlw", "hello", "bitcoin") never match
  const relevant = scored
    .filter((item) => item.score >= 4)
    .sort((a, b) => b.score - a.score);

  // If multiple studies matched, filter out very weak partial matches (< 35% of top score)
  if (relevant.length > 0) {
    const topScore = relevant[0].score;
    return relevant
      .filter((item) => item.score >= Math.max(4, topScore * 0.4))
      .slice(0, maxResults)
      .map((item) => item.study);
  }

  return [];
}

function buildGroundedResponse(query: string, matchedStudies: StudyEntry[]): string {
  if (matchedStudies.length === 0) {
    return (
      `No peer-reviewed studies in the Depthline database match "${query}".\n\n` +
      `Try searching for a specific product, polymer, or environment covered in our research index — ` +
      `for example: bottled water, PET, table salt, seafood, fish, wastewater effluent, tap water, human blood, tea bags, toothpaste, or Bangladesh rivers.`
    );
  }

  const bullets = matchedStudies.map(
    (s, idx) =>
      `• ${s.product_name} (${s.location}): Reported ${s.microplastic_type} at ${s.concentration.toLocaleString()} ${s.unit} via ${s.detection_method} [${idx + 1}].`
  );

  return (
    `Yes — found ${matchedStudies.length} peer-reviewed ${matchedStudies.length === 1 ? "study" : "studies"} in the Depthline database matching "${query}":\n\n` +
    bullets.join("\n")
  );
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 1) {
    return NextResponse.json({ detail: "Query parameter 'q' is required." }, { status: 400 });
  }

  const matched = findMatchingStudies(q, 5);
  const answer = buildGroundedResponse(q, matched);
  const sources = matched.map((s) => ({
    product_name: s.product_name,
    microplastic_type: s.microplastic_type,
    location: s.location,
    publication_link: s.publication_link,
  }));

  return NextResponse.json(
    { answer, sources },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
