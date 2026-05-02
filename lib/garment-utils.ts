export type NormalizedGarmentCategory = "top" | "bottom" | "shoes" | "outerwear";
export type NormalizedGarmentSeason = "summer" | "winter" | "all";

const categoryAliasMap: Record<string, NormalizedGarmentCategory> = {
  top: "top",
  tops: "top",
  shirt: "top",
  shirts: "top",
  tshirt: "top",
  "t-shirt": "top",
  tee: "top",
  upper: "top",
  bottom: "bottom",
  bottoms: "bottom",
  pants: "bottom",
  trouser: "bottom",
  trousers: "bottom",
  jeans: "bottom",
  skirt: "bottom",
  shorts: "bottom",
  shoes: "shoes",
  shoe: "shoes",
  sneaker: "shoes",
  sneakers: "shoes",
  boot: "shoes",
  boots: "shoes",
  footwear: "shoes",
  outerwear: "outerwear",
  outer: "outerwear",
  jacket: "outerwear",
  coat: "outerwear",
  blazer: "outerwear",
  layer: "outerwear",
};

const seasonAliasMap: Record<string, NormalizedGarmentSeason> = {
  summer: "summer",
  invierno: "winter",
  winter: "winter",
  all: "all",
  allyear: "all",
  "all-year": "all",
  "todo-el-año": "all",
  todoelaño: "all",
};

function cleanValue(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function normalizeGarmentCategory(value: unknown): NormalizedGarmentCategory {
  const normalized = cleanValue(value);
  return categoryAliasMap[normalized] ?? "top";
}

export function normalizeGarmentSeason(value: unknown): NormalizedGarmentSeason {
  const normalized = cleanValue(value).replace(/\s+/g, "");
  return seasonAliasMap[normalized] ?? "all";
}
