import { categories, CategoryKey } from "./report-types";

export const categoryPriorities = {
  infrastructure: "MEDIUM", "clean-green": "LOW", "safety-transport": "HIGH",
  "public-transport": "MEDIUM", "water-utilities": "HIGH", environment: "MEDIUM",
  accessibility: "MEDIUM", recreation: "MEDIUM"
} as const satisfies Record<CategoryKey, "LOW" | "MEDIUM" | "HIGH">;

export type PhotoSuggestion = { category: CategoryKey; subcategoryIndex: number };
export function parsePhotoSuggestion(content: unknown): PhotoSuggestion | null {
  if (typeof content !== "string") throw new Error("Invalid vision response");
  const parsed = JSON.parse(content.replace(/^\s*```(?:json)?\s*/, "").replace(/\s*```\s*$/, ""));
  if (!parsed || !Object.hasOwn(parsed, "suggestion")) throw new Error("Missing suggestion");
  if (parsed.suggestion === null) return null;
  const value = parsed.suggestion;
  const category = categories.find(item => item.key === value?.category);
  if (!category || !Number.isInteger(value.subcategoryIndex) || value.subcategoryIndex < 0 || value.subcategoryIndex >= category.items.length) throw new Error("Invalid catalog mapping");
  return { category: category.key, subcategoryIndex: value.subcategoryIndex };
}

export async function optimizePhoto(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 768 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", .8);
  } finally { URL.revokeObjectURL(url); }
}
