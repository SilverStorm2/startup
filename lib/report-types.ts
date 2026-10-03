export type CategoryKey = "infrastructure" | "clean-green" | "safety-transport";

export const categories = [
  {
    key: "infrastructure",
    pl: "Infrastruktura",
    en: "Infrastructure",
    items: [
      { pl: "Dziura w jezdni", en: "Road damage" },
      { pl: "Uszkodzony chodnik", en: "Damaged pavement" },
      { pl: "Niedziałająca latarnia", en: "Streetlight failure" }
    ]
  },
  {
    key: "clean-green",
    pl: "Czystość i zieleń",
    en: "Cleanliness & greenery",
    items: [
      { pl: "Śmieci", en: "Waste" },
      { pl: "Przewrócone drzewo", en: "Fallen tree" },
      { pl: "Zalana przestrzeń", en: "Flooded area" }
    ]
  },
  {
    key: "safety-transport",
    pl: "Bezpieczeństwo i transport",
    en: "Safety & transport",
    items: [
      { pl: "Zablokowany przejazd", en: "Blocked passage" },
      { pl: "Problem z oznakowaniem", en: "Signage issue" },
      { pl: "Utrudnienie komunikacyjne", en: "Transport disruption" }
    ]
  }
] as const;

export type StoredReport = {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  lat: number;
  lng: number;
  createdAt: string;
  status: "Przyjęte";
};
