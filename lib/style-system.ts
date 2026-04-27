export type UserGender = "male" | "female";
export type AppLanguage = "es" | "en";

type LocalizedText = {
  es: string;
  en: string;
};

type StyleSeed = {
  id: string;
  label: string;
  note: LocalizedText;
  imageUrl: string;
};

export type StyleOption = StyleSeed;

const styleSeeds: Record<UserGender, StyleSeed[]> = {
  male: [
    {
      id: "minimal",
      label: "Minimal",
      note: {
        es: "Líneas limpias, paleta neutra y un look sereno sin ruido visual.",
        en: "Clean lines, neutral palettes, and a calm look with no visual noise.",
      },
      imageUrl: "/styles/male/minimal.jpg",
    },
    {
      id: "clean-fit",
      label: "Clean Fit",
      note: {
        es: "Básicos premium, proporciones cuidadas y un acabado prolijo y actual.",
        en: "Premium basics, balanced proportions, and a polished contemporary finish.",
      },
      imageUrl: "/styles/male/clean-fit.jpg",
    },
    {
      id: "old-money",
      label: "Old Money",
      note: {
        es: "Elegancia clásica, tonos refinados y prendas atemporales de aire lujoso.",
        en: "Classic elegance, refined tones, and timeless pieces with a luxurious feel.",
      },
      imageUrl: "/styles/male/old-money.jpg",
    },
    {
      id: "smart-casual",
      label: "Smart Casual",
      note: {
        es: "Equilibrio entre prolijidad y comodidad con prendas versátiles y pulidas.",
        en: "A balance of polish and comfort with versatile, elevated pieces.",
      },
      imageUrl: "/styles/male/smart-casual.jpg",
    },
    {
      id: "formal-classic",
      label: "Formal Classic",
      note: {
        es: "Sastrería estructurada, elegancia tradicional y presencia impecable.",
        en: "Structured tailoring, traditional elegance, and impeccable presence.",
      },
      imageUrl: "/styles/male/formal-classic.jpg",
    },
    {
      id: "quiet-luxury",
      label: "Quiet Luxury",
      note: {
        es: "Prendas discretas, materiales nobles y sofisticación sin logos visibles.",
        en: "Quiet pieces, rich materials, and sophistication without visible logos.",
      },
      imageUrl: "/styles/male/quiet-luxury.jpg",
    },
    {
      id: "business-core",
      label: "Business Core",
      note: {
        es: "Oficina moderna con siluetas precisas, camisas limpias y tonos sobrios.",
        en: "Modern office dressing with precise silhouettes, clean shirting, and restrained tones.",
      },
      imageUrl: "/styles/male/business-core.jpg",
    },
    {
      id: "streetwear",
      label: "Streetwear",
      note: {
        es: "Capas urbanas, sneakers protagonistas y una actitud visual fuerte.",
        en: "Urban layers, standout sneakers, and a strong visual attitude.",
      },
      imageUrl: "/styles/male/streetwear.jpg",
    },
    {
      id: "urban",
      label: "Urban",
      note: {
        es: "Look citadino relajado con denim, básicos modernos y energía diaria.",
        en: "Relaxed city dressing with denim, modern basics, and everyday energy.",
      },
      imageUrl: "/styles/male/urban.jpg",
    },
    {
      id: "techwear",
      label: "Techwear",
      note: {
        es: "Estética funcional y futurista con capas técnicas y detalles utilitarios.",
        en: "Functional, futuristic dressing with technical layers and utilitarian details.",
      },
      imageUrl: "/styles/male/techwear.jpg",
    },
    {
      id: "grunge",
      label: "Grunge",
      note: {
        es: "Texturas gastadas, capas oscuras y una vibra descontracturada con carácter.",
        en: "Worn textures, darker layers, and an undone vibe with character.",
      },
      imageUrl: "/styles/male/grunge.jpg",
    },
    {
      id: "dark-academia",
      label: "Dark Academia",
      note: {
        es: "Tonos profundos, capas intelectuales y un aire clásico melancólico.",
        en: "Deep tones, intellectual layering, and a moody classic atmosphere.",
      },
      imageUrl: "/styles/male/dark-academia.jpg",
    },
    {
      id: "athleisure",
      label: "Athleisure",
      note: {
        es: "Comodidad deportiva elevada para usar fuera del gimnasio con estilo.",
        en: "Elevated sportswear comfort designed to work beyond the gym.",
      },
      imageUrl: "/styles/male/athleisure.jpg",
    },
    {
      id: "sporty",
      label: "Sporty",
      note: {
        es: "Prendas activas, funcionales y cómodas con foco en movimiento y energía.",
        en: "Active, functional, comfortable dressing focused on movement and energy.",
      },
      imageUrl: "/styles/male/sporty.jpg",
    },
    {
      id: "skater",
      label: "Skater",
      note: {
        es: "Siluetas amplias, denim relajado y una vibra juvenil de calle.",
        en: "Loose silhouettes, relaxed denim, and a youthful street-driven vibe.",
      },
      imageUrl: "/styles/male/skater.jpg",
    },
    {
      id: "workwear",
      label: "Workwear",
      note: {
        es: "Prendas resistentes, bolsillos utilitarios y tonos terrosos con estructura.",
        en: "Durable garments, utility pockets, and grounded earth tones with structure.",
      },
      imageUrl: "/styles/male/workwear.jpg",
    },
    {
      id: "preppy",
      label: "Preppy",
      note: {
        es: "Universitario pulido con polos, tejidos livianos y guiños clásicos.",
        en: "Polished collegiate dressing with polos, light knits, and classic references.",
      },
      imageUrl: "/styles/male/preppy.jpg",
    },
    {
      id: "resort",
      label: "Resort",
      note: {
        es: "Ligero, relajado y sofisticado para clima cálido y looks frescos.",
        en: "Light, relaxed, and refined for warm weather and breezy looks.",
      },
      imageUrl: "/styles/male/resort.jpg",
    },
    {
      id: "monochrome",
      label: "Monochrome",
      note: {
        es: "Outfits construidos casi en un solo tono para verse limpios y modernos.",
        en: "Outfits built around nearly one tone for a clean, modern result.",
      },
      imageUrl: "/styles/male/monochrome.jpg",
    },
    {
      id: "elevated-basics",
      label: "Elevated Basics",
      note: {
        es: "Esenciales cotidianos mejorados con mejor fit, textura y terminación.",
        en: "Everyday essentials improved through better fit, texture, and finish.",
      },
      imageUrl: "/styles/male/elevated-basics.jpg",
    },
  ],
  female: [
    {
      id: "minimal-chic",
      label: "Minimal Chic",
      note: {
        es: "Sofisticado y limpio, con siluetas simples y lujo discreto.",
        en: "Sophisticated and clean, with simple silhouettes and quiet luxury.",
      },
      imageUrl: "/styles/female/minimal-chic.jpg",
    },
    {
      id: "minimal",
      label: "Minimal",
      note: {
        es: "Paleta neutra, cortes limpios y una estética serena y moderna.",
        en: "Neutral palettes, clean cuts, and a calm modern aesthetic.",
      },
      imageUrl: "/styles/female/minimal.jpg",
    },
    {
      id: "clean-fit",
      label: "Clean Fit",
      note: {
        es: "Básicos pulidos, proporciones precisas y un look impecable sin esfuerzo.",
        en: "Polished basics, precise proportions, and an effortlessly refined look.",
      },
      imageUrl: "/styles/female/clean-fit.jpg",
    },
    {
      id: "old-money",
      label: "Old Money",
      note: {
        es: "Elegancia clásica y atemporal con prendas refinadas y tonos nobles.",
        en: "Classic, timeless elegance with refined pieces and rich neutral tones.",
      },
      imageUrl: "/styles/female/old-money.jpg",
    },
    {
      id: "quiet-luxury",
      label: "Quiet Luxury",
      note: {
        es: "Calidad visual alta, detalles sutiles y sofisticación sin estridencias.",
        en: "High visual quality, subtle details, and sophistication without excess.",
      },
      imageUrl: "/styles/female/quiet-luxury.jpg",
    },
    {
      id: "coquette",
      label: "Coquette",
      note: {
        es: "Romántico, delicado y femenino con detalles suaves y encanto visual.",
        en: "Romantic, delicate, and feminine with soft details and visual charm.",
      },
      imageUrl: "/styles/female/coquette.jpg",
    },
    {
      id: "soft-girl",
      label: "Soft Girl",
      note: {
        es: "Tonos suaves, texturas livianas y una vibra dulce y luminosa.",
        en: "Soft tones, airy textures, and a sweet, bright vibe.",
      },
      imageUrl: "/styles/female/soft-girl.jpg",
    },
    {
      id: "boho",
      label: "Boho",
      note: {
        es: "Libre y orgánico, con capas fluidas, texturas naturales y tonos tierra.",
        en: "Free-spirited and organic, with flowing layers, natural textures, and earthy tones.",
      },
      imageUrl: "/styles/female/boho.jpg",
    },
    {
      id: "elegant-formal",
      label: "Elegant Formal",
      note: {
        es: "Estructurado, refinado y seguro para ocasiones que piden presencia.",
        en: "Structured, refined, and confident for occasions that require presence.",
      },
      imageUrl: "/styles/female/elegant-formal.jpg",
    },
    {
      id: "office-chic",
      label: "Office Chic",
      note: {
        es: "Profesional moderno con líneas definidas y detalles bien cuidados.",
        en: "Modern professional dressing with defined lines and considered details.",
      },
      imageUrl: "/styles/female/office-chic.jpg",
    },
    {
      id: "streetwear",
      label: "Streetwear",
      note: {
        es: "Capas urbanas, prendas con actitud y energía cool bien marcada.",
        en: "Urban layering, attitude-driven pieces, and a distinctly cool energy.",
      },
      imageUrl: "/styles/female/streetwear.jpg",
    },
    {
      id: "urban",
      label: "Urban",
      note: {
        es: "Look de ciudad contemporáneo con básicos modernos y denim protagonista.",
        en: "Contemporary city dressing with modern basics and denim-driven styling.",
      },
      imageUrl: "/styles/female/urban.jpg",
    },
    {
      id: "y2k",
      label: "Y2K",
      note: {
        es: "Pop nostálgico, brillo y siluetas más atrevidas con espíritu dosmilero.",
        en: "Nostalgic pop, shine, and bolder silhouettes with early-2000s energy.",
      },
      imageUrl: "/styles/female/y2k.jpg",
    },
    {
      id: "dark-feminine",
      label: "Dark Feminine",
      note: {
        es: "Sensual, intenso y elegante con tonos profundos y presencia fuerte.",
        en: "Sensual, intense, and elegant with deeper tones and strong presence.",
      },
      imageUrl: "/styles/female/dark-feminine.jpg",
    },
    {
      id: "techwear",
      label: "Techwear",
      note: {
        es: "Funcional y futurista con capas técnicas, negro utilitario y precisión.",
        en: "Functional and futuristic with technical layering, utilitarian black, and precision.",
      },
      imageUrl: "/styles/female/techwear.jpg",
    },
    {
      id: "sporty-chic",
      label: "Sporty Chic",
      note: {
        es: "Activewear prolijo mezclado con piezas modernas y estilizadas.",
        en: "Polished activewear mixed with modern, styled pieces.",
      },
      imageUrl: "/styles/female/sporty-chic.jpg",
    },
    {
      id: "athleisure",
      label: "Athleisure",
      note: {
        es: "Comodidad deportiva llevada al día a día con una estética cuidada.",
        en: "Sportswear comfort brought into daily life with a styled aesthetic.",
      },
      imageUrl: "/styles/female/athleisure.jpg",
    },
    {
      id: "scandi",
      label: "Scandi",
      note: {
        es: "Limpio, funcional y luminoso con siluetas relajadas y materiales nobles.",
        en: "Clean, functional, and bright with relaxed silhouettes and quality fabrics.",
      },
      imageUrl: "/styles/female/scandi.jpg",
    },
    {
      id: "balletcore",
      label: "Balletcore",
      note: {
        es: "Delicado y etéreo, inspirado en ballet con suavidad y gracia visual.",
        en: "Delicate and ethereal, inspired by ballet with softness and visual grace.",
      },
      imageUrl: "/styles/female/balletcore.jpg",
    },
    {
      id: "romantic",
      label: "Romantic",
      note: {
        es: "Femenino clásico con caídas suaves, detalles sutiles y aire elegante.",
        en: "Classic feminine dressing with soft drape, subtle details, and an elegant feel.",
      },
      imageUrl: "/styles/female/romantic.jpg",
    },
  ],
};

const compatibilityGroups = [
  ["minimal", "clean-fit", "old-money", "quiet-luxury", "smart-casual", "formal-classic", "business-core", "preppy", "office-chic", "minimal-chic", "elegant-formal", "scandi", "monochrome", "elevated-basics"],
  ["streetwear", "urban", "techwear", "grunge", "y2k", "athleisure", "sporty", "sporty-chic", "skater", "workwear", "dark-feminine"],
  ["coquette", "soft-girl", "balletcore", "romantic", "minimal-chic"],
  ["boho", "resort", "romantic", "elegant-formal"],
  ["dark-academia", "formal-classic", "old-money", "business-core", "preppy"],
];

function createCompatibilityMap() {
  const map: Record<string, string[]> = {};

  for (const styles of compatibilityGroups) {
    for (const style of styles) {
      map[style] = Array.from(new Set([...(map[style] ?? []), ...styles]));
    }
  }

  for (const style of Object.values(styleSeeds).flat()) {
    map[style.id] = Array.from(new Set([...(map[style.id] ?? []), style.id]));
  }

  return map;
}

const defaultPalette = {
  base: ["cream", "navy", "black"],
  secondary: ["beige", "gray", "white"],
  accent: ["burgundy", "forest", "steel blue"],
};

export const styleCompatibilityMap: Record<string, string[]> =
  createCompatibilityMap();

export const stylePaletteMap: Record<
  string,
  { base: string[]; secondary: string[]; accent: string[] }
> = {
  minimal: {
    base: ["white", "black", "gray"],
    secondary: ["stone", "beige", "navy"],
    accent: ["olive"],
  },
  "clean-fit": {
    base: ["white", "cream", "navy"],
    secondary: ["taupe", "gray", "stone"],
    accent: ["sage"],
  },
  "old-money": {
    base: ["beige", "navy", "cream"],
    secondary: ["brown", "white", "camel"],
    accent: ["forest", "burgundy"],
  },
  "smart-casual": {
    base: ["navy", "white", "beige"],
    secondary: ["camel", "taupe", "gray"],
    accent: ["dusty blue"],
  },
  "formal-classic": {
    base: ["navy", "charcoal", "white"],
    secondary: ["black", "gray"],
    accent: ["burgundy"],
  },
  "quiet-luxury": {
    base: ["cream", "taupe", "espresso"],
    secondary: ["beige", "stone", "white"],
    accent: ["forest"],
  },
  "business-core": {
    base: ["charcoal", "navy", "white"],
    secondary: ["gray", "camel", "black"],
    accent: ["burgundy"],
  },
  streetwear: {
    base: ["black", "charcoal", "white"],
    secondary: ["olive", "navy", "stone"],
    accent: ["rust", "cobalt"],
  },
  urban: {
    base: ["black", "denim blue", "white"],
    secondary: ["gray", "olive", "tan"],
    accent: ["red oxide"],
  },
  techwear: {
    base: ["black", "slate", "graphite"],
    secondary: ["olive", "charcoal"],
    accent: ["steel blue"],
  },
  grunge: {
    base: ["black", "washed gray", "dark denim"],
    secondary: ["burgundy", "olive"],
    accent: ["plaid red"],
  },
  "dark-academia": {
    base: ["brown", "charcoal", "olive"],
    secondary: ["camel", "cream", "burgundy"],
    accent: ["oxblood"],
  },
  athleisure: {
    base: ["black", "white", "heather gray"],
    secondary: ["stone", "navy", "forest"],
    accent: ["electric blue"],
  },
  sporty: {
    base: ["white", "black", "navy"],
    secondary: ["gray", "forest"],
    accent: ["royal blue"],
  },
  skater: {
    base: ["black", "washed blue", "white"],
    secondary: ["khaki", "gray", "olive"],
    accent: ["mustard"],
  },
  workwear: {
    base: ["camel", "olive", "navy"],
    secondary: ["brown", "ecru", "charcoal"],
    accent: ["rust"],
  },
  preppy: {
    base: ["navy", "white", "cream"],
    secondary: ["green", "camel", "gray"],
    accent: ["burgundy"],
  },
  resort: {
    base: ["sand", "white", "light blue"],
    secondary: ["olive", "tan", "cream"],
    accent: ["terracotta"],
  },
  monochrome: {
    base: ["black", "cream", "gray"],
    secondary: ["black", "cream", "gray"],
    accent: ["gray"],
  },
  "elevated-basics": {
    base: ["white", "navy", "stone"],
    secondary: ["gray", "camel", "black"],
    accent: ["forest"],
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
  "office-chic": {
    base: ["cream", "charcoal", "black"],
    secondary: ["taupe", "white", "navy"],
    accent: ["wine"],
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
  scandi: {
    base: ["cream", "light gray", "black"],
    secondary: ["taupe", "white", "soft blue"],
    accent: ["sage"],
  },
  balletcore: {
    base: ["blush", "cream", "soft gray"],
    secondary: ["white", "dusty rose"],
    accent: ["silver"],
  },
  romantic: {
    base: ["cream", "rose", "soft taupe"],
    secondary: ["white", "burgundy", "beige"],
    accent: ["plum"],
  },
};

export const styleSilhouetteMap: Record<string, string[]> = {
  minimal: ["clean", "straight"],
  "clean-fit": ["slim", "clean"],
  "old-money": ["tailored", "clean"],
  "smart-casual": ["tailored", "balanced"],
  "formal-classic": ["structured", "tailored"],
  "quiet-luxury": ["clean", "tailored"],
  "business-core": ["structured", "tailored"],
  streetwear: ["oversized", "layered"],
  urban: ["relaxed", "clean"],
  techwear: ["structured", "layered"],
  grunge: ["relaxed", "layered"],
  "dark-academia": ["tailored", "layered"],
  athleisure: ["athletic", "relaxed"],
  sporty: ["athletic", "relaxed"],
  skater: ["oversized", "relaxed"],
  workwear: ["boxy", "structured"],
  preppy: ["clean", "tailored"],
  resort: ["relaxed", "flowy"],
  monochrome: ["clean", "elongated"],
  "elevated-basics": ["clean", "balanced"],
  "minimal-chic": ["clean", "tailored"],
  coquette: ["fitted", "soft"],
  "soft-girl": ["soft", "relaxed"],
  boho: ["flowy", "layered"],
  "elegant-formal": ["structured", "fitted"],
  "office-chic": ["tailored", "clean"],
  y2k: ["cropped", "playful"],
  "dark-feminine": ["fitted", "sharp"],
  "sporty-chic": ["athletic", "clean"],
  scandi: ["relaxed", "clean"],
  balletcore: ["fitted", "soft"],
  romantic: ["soft", "draped"],
};

export function normalizeGender(input?: string | null): UserGender {
  const normalized = input?.toLowerCase().trim();

  if (normalized === "female" || normalized === "mujer") {
    return "female";
  }

  return "male";
}

export function getStyleOptions(gender: UserGender): StyleOption[] {
  return styleSeeds[gender];
}

export function getStyleImageDirectories() {
  return {
    male: "/public/styles/male",
    female: "/public/styles/female",
  };
}

export function getPaletteForStyle(style: string) {
  return stylePaletteMap[style] ?? defaultPalette;
}
