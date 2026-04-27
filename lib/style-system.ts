export type UserGender = "male" | "female";
export type AppLanguage = "es" | "en";

type LocalizedText = {
  es: string;
  en: string;
};

type StyleSeed = {
  id: string;
  label: LocalizedText;
  example: LocalizedText;
  note: LocalizedText;
  accent: string;
};

export type StyleOption = StyleSeed & {
  imageUrl: string;
};

const styleSeeds: Record<UserGender, StyleSeed[]> = {
  male: [
    {
      id: "streetwear",
      label: { es: "Streetwear", en: "Streetwear" },
      example: { es: "buzos boxy y sneakers", en: "boxy hoodies and sneakers" },
      note: { es: "urbano, relajado y con presencia", en: "urban, relaxed, and bold" },
      accent: "#D97757",
    },
    {
      id: "old-money",
      label: { es: "Old Money", en: "Old Money" },
      example: { es: "camisas, knitwear y sastrería", en: "shirts, knitwear, and tailoring" },
      note: { es: "elegancia clásica sin esfuerzo", en: "classic elegance without trying too hard" },
      accent: "#8D6E63",
    },
    {
      id: "techwear",
      label: { es: "Techwear", en: "Techwear" },
      example: { es: "capas técnicas y negro utilitario", en: "technical layers and utilitarian black" },
      note: { es: "funcional, futurista y estructurado", en: "functional, futuristic, and structured" },
      accent: "#3B5B7A",
    },
    {
      id: "smart-casual",
      label: { es: "Smart Casual", en: "Smart Casual" },
      example: { es: "blazer liviano y chinos", en: "light blazer and chinos" },
      note: { es: "prolijo, moderno y versátil", en: "polished, modern, and versatile" },
      accent: "#4D6C8C",
    },
    {
      id: "minimal",
      label: { es: "Minimal", en: "Minimal" },
      example: { es: "líneas limpias y neutros", en: "clean lines and neutrals" },
      note: { es: "limpio, sereno y preciso", en: "clean, calm, and precise" },
      accent: "#7C8A96",
    },
    {
      id: "grunge",
      label: { es: "Grunge", en: "Grunge" },
      example: { es: "capas gastadas y denim oscuro", en: "worn layers and dark denim" },
      note: { es: "desprolijo intencional con actitud", en: "intentionally undone with attitude" },
      accent: "#6B4F4F",
    },
    {
      id: "sporty",
      label: { es: "Sporty", en: "Sporty" },
      example: { es: "sets cómodos y performance", en: "comfortable sets and performance wear" },
      note: { es: "activo, limpio y funcional", en: "active, clean, and functional" },
      accent: "#4A7C59",
    },
    {
      id: "formal-classic",
      label: { es: "Formal Classic", en: "Formal Classic" },
      example: { es: "trajes y zapatos pulidos", en: "suits and polished shoes" },
      note: { es: "sofisticado, estructurado y atemporal", en: "sophisticated, structured, and timeless" },
      accent: "#23395B",
    },
    {
      id: "clean-fit",
      label: { es: "Clean Fit", en: "Clean Fit" },
      example: { es: "básicos premium y ajuste prolijo", en: "premium basics and sharp proportions" },
      note: { es: "pulcro, joven y muy cuidado", en: "fresh, youthful, and carefully styled" },
      accent: "#9C8061",
    },
  ],
  female: [
    {
      id: "minimal-chic",
      label: { es: "Minimal Chic", en: "Minimal Chic" },
      example: { es: "siluetas limpias y tonos suaves", en: "clean silhouettes and soft tones" },
      note: { es: "elegancia simple con acabado premium", en: "simple elegance with a premium finish" },
      accent: "#C59F8D",
    },
    {
      id: "old-money",
      label: { es: "Old Money", en: "Old Money" },
      example: { es: "tejidos finos y sastrería suave", en: "fine knits and soft tailoring" },
      note: { es: "lujo silencioso y clásico", en: "quiet luxury and classic polish" },
      accent: "#8D6E63",
    },
    {
      id: "coquette",
      label: { es: "Coquette", en: "Coquette" },
      example: { es: "moños, perlas y romanticismo", en: "bows, pearls, and romance" },
      note: { es: "femenino, delicado y coqueto", en: "feminine, delicate, and playful" },
      accent: "#D990B8",
    },
    {
      id: "streetwear",
      label: { es: "Streetwear", en: "Streetwear" },
      example: { es: "oversize, sneakers y capas", en: "oversized shapes, sneakers, and layers" },
      note: { es: "urbano con energía cool", en: "urban with cool energy" },
      accent: "#D97757",
    },
    {
      id: "soft-girl",
      label: { es: "Soft Girl", en: "Soft Girl" },
      example: { es: "pasteles y texturas suaves", en: "pastels and soft textures" },
      note: { es: "dulce, liviano y luminoso", en: "sweet, airy, and bright" },
      accent: "#E9B7C8",
    },
    {
      id: "boho",
      label: { es: "Boho", en: "Boho" },
      example: { es: "capas fluidas y tierra", en: "flowing layers and earthy tones" },
      note: { es: "orgánico, libre y artesanal", en: "organic, free, and artisanal" },
      accent: "#B9845A",
    },
    {
      id: "elegant-formal",
      label: { es: "Elegant Formal", en: "Elegant Formal" },
      example: { es: "vestidos pulidos y tacones limpios", en: "polished dresses and clean heels" },
      note: { es: "refinado, nítido y sofisticado", en: "refined, crisp, and sophisticated" },
      accent: "#3E4C6D",
    },
    {
      id: "y2k",
      label: { es: "Y2K", en: "Y2K" },
      example: { es: "brillos, baby tees y nostalgia pop", en: "shine, baby tees, and pop nostalgia" },
      note: { es: "divertido, atrevido y retro", en: "playful, bold, and retro" },
      accent: "#7B6CF6",
    },
    {
      id: "dark-feminine",
      label: { es: "Dark Feminine", en: "Dark Feminine" },
      example: { es: "negro, borgoña y siluetas marcadas", en: "black, burgundy, and defined silhouettes" },
      note: { es: "dramático, sensual y elegante", en: "dramatic, sensual, and elegant" },
      accent: "#7C3048",
    },
    {
      id: "sporty-chic",
      label: { es: "Sporty Chic", en: "Sporty Chic" },
      example: { es: "athleisure pulido y clean", en: "polished, clean athleisure" },
      note: { es: "activo pero elevado", en: "active yet elevated" },
      accent: "#4A7C59",
    },
  ],
};

function encodeSvg(value: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(value)}`;
}

function buildStyleImage(
  label: string,
  example: string,
  note: string,
  accent: string,
  gender: UserGender
) {
  const background = gender === "male" ? "#F6EFE0" : "#F8F1E8";
  const secondary = gender === "male" ? "#243B63" : "#2F456B";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
      <rect width="640" height="800" rx="44" fill="${background}" />
      <rect x="34" y="34" width="572" height="732" rx="36" fill="white" opacity="0.72" />
      <circle cx="507" cy="144" r="104" fill="${accent}" opacity="0.24" />
      <circle cx="138" cy="664" r="118" fill="${secondary}" opacity="0.08" />
      <path d="M150 378c58-92 122-138 192-138 76 0 140 48 190 146" fill="none" stroke="${secondary}" stroke-width="18" stroke-linecap="round" opacity="0.18"/>
      <rect x="154" y="214" width="332" height="404" rx="166" fill="${secondary}" opacity="0.08" />
      <path d="M228 304c20-36 54-56 92-56s72 20 92 56l38 226H190l38-226Z" fill="${accent}" opacity="0.88"/>
      <circle cx="320" cy="234" r="62" fill="${secondary}" opacity="0.92"/>
      <rect x="88" y="580" width="464" height="128" rx="28" fill="white" opacity="0.94"/>
      <text x="112" y="628" font-family="Georgia, serif" font-size="36" fill="${secondary}" font-weight="700">${label}</text>
      <text x="112" y="664" font-family="Arial, sans-serif" font-size="20" fill="${secondary}" opacity="0.78">${example}</text>
      <text x="112" y="696" font-family="Arial, sans-serif" font-size="20" fill="${secondary}" opacity="0.58">${note}</text>
    </svg>
  `;

  return encodeSvg(svg);
}

export function normalizeGender(input?: string | null): UserGender {
  const normalized = input?.toLowerCase().trim();

  if (normalized === "female" || normalized === "mujer") {
    return "female";
  }

  return "male";
}

export function getStyleOptions(gender: UserGender): StyleOption[] {
  return styleSeeds[gender].map((seed) => ({
    ...seed,
    imageUrl: buildStyleImage(
      seed.label.en,
      seed.example.en,
      seed.note.en,
      seed.accent,
      gender
    ),
  }));
}

export const styleCompatibilityMap: Record<string, string[]> = {
  streetwear: ["streetwear", "techwear", "y2k", "sporty", "sporty-chic", "grunge"],
  "old-money": ["old-money", "minimal", "minimal-chic", "smart-casual", "clean-fit", "formal-classic", "elegant-formal"],
  techwear: ["techwear", "streetwear", "sporty", "dark-feminine"],
  "smart-casual": ["smart-casual", "old-money", "minimal", "clean-fit", "formal-classic"],
  minimal: ["minimal", "minimal-chic", "old-money", "smart-casual", "clean-fit", "elegant-formal"],
  grunge: ["grunge", "streetwear", "dark-feminine", "y2k"],
  sporty: ["sporty", "sporty-chic", "streetwear", "techwear"],
  "formal-classic": ["formal-classic", "old-money", "smart-casual", "elegant-formal"],
  "clean-fit": ["clean-fit", "minimal", "smart-casual", "old-money"],
  "minimal-chic": ["minimal-chic", "minimal", "old-money", "elegant-formal", "sporty-chic"],
  coquette: ["coquette", "soft-girl", "old-money"],
  "soft-girl": ["soft-girl", "coquette", "minimal-chic"],
  boho: ["boho", "elegant-formal"],
  "elegant-formal": ["elegant-formal", "old-money", "minimal-chic", "formal-classic"],
  y2k: ["y2k", "streetwear", "dark-feminine"],
  "dark-feminine": ["dark-feminine", "y2k", "grunge", "elegant-formal", "techwear"],
  "sporty-chic": ["sporty-chic", "sporty", "minimal-chic", "streetwear"],
};

export const stylePaletteMap: Record<
  string,
  { base: string[]; secondary: string[]; accent: string[] }
> = {
  streetwear: {
    base: ["black", "charcoal", "white"],
    secondary: ["olive", "navy", "stone"],
    accent: ["rust", "cobalt"],
  },
  "old-money": {
    base: ["beige", "navy", "cream"],
    secondary: ["brown", "white", "camel"],
    accent: ["forest", "burgundy"],
  },
  techwear: {
    base: ["black", "slate", "graphite"],
    secondary: ["olive", "charcoal"],
    accent: ["steel blue"],
  },
  "smart-casual": {
    base: ["navy", "white", "beige"],
    secondary: ["camel", "taupe", "gray"],
    accent: ["dusty blue"],
  },
  minimal: {
    base: ["white", "black", "gray"],
    secondary: ["stone", "beige", "navy"],
    accent: ["olive"],
  },
  grunge: {
    base: ["black", "washed gray", "dark denim"],
    secondary: ["burgundy", "olive"],
    accent: ["plaid red"],
  },
  sporty: {
    base: ["white", "black", "navy"],
    secondary: ["gray", "forest"],
    accent: ["royal blue"],
  },
  "formal-classic": {
    base: ["navy", "charcoal", "white"],
    secondary: ["black", "gray"],
    accent: ["burgundy"],
  },
  "clean-fit": {
    base: ["white", "cream", "navy"],
    secondary: ["taupe", "gray"],
    accent: ["sage"],
  },
  "minimal-chic": {
    base: ["cream", "black", "taupe"],
    secondary: ["white", "gray"],
    accent: ["soft gold"],
  },
  coquette: {
    base: ["blush", "cream", "white"],
    secondary: ["black", "rose"],
    accent: ["ruby"],
  },
  "soft-girl": {
    base: ["powder pink", "cream", "light gray"],
    secondary: ["lavender", "beige"],
    accent: ["baby blue"],
  },
  boho: {
    base: ["sand", "ivory", "brown"],
    secondary: ["terracotta", "olive"],
    accent: ["turquoise"],
  },
  "elegant-formal": {
    base: ["black", "navy", "cream"],
    secondary: ["champagne", "charcoal"],
    accent: ["burgundy"],
  },
  y2k: {
    base: ["black", "white", "denim blue"],
    secondary: ["silver", "pink"],
    accent: ["lavender"],
  },
  "dark-feminine": {
    base: ["black", "burgundy", "espresso"],
    secondary: ["charcoal", "plum"],
    accent: ["deep red"],
  },
  "sporty-chic": {
    base: ["white", "black", "stone"],
    secondary: ["gray", "navy"],
    accent: ["sage"],
  },
};

export const styleSilhouetteMap: Record<string, string[]> = {
  streetwear: ["oversized", "layered"],
  "old-money": ["tailored", "clean"],
  techwear: ["structured", "layered"],
  "smart-casual": ["tailored", "balanced"],
  minimal: ["clean", "straight"],
  grunge: ["relaxed", "layered"],
  sporty: ["athletic", "relaxed"],
  "formal-classic": ["structured", "tailored"],
  "clean-fit": ["slim", "clean"],
  "minimal-chic": ["clean", "tailored"],
  coquette: ["fitted", "soft"],
  "soft-girl": ["soft", "relaxed"],
  boho: ["flowy", "layered"],
  "elegant-formal": ["structured", "fitted"],
  y2k: ["cropped", "playful"],
  "dark-feminine": ["fitted", "sharp"],
  "sporty-chic": ["athletic", "clean"],
};
