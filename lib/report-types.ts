export const categories = [
  {
    key: "infrastructure",
    pl: "Infrastruktura",
    en: "Infrastructure",
    items: [
      { pl: "Dziura w jezdni", en: "Road damage" },
      { pl: "Uszkodzony chodnik", en: "Damaged pavement" },
      { pl: "Niedziałająca latarnia", en: "Streetlight failure" },
      { pl: "Uszkodzona ławka", en: "Damaged bench" },
      { pl: "Uszkodzona barierka", en: "Damaged railing" },
      { pl: "Uszkodzone schody", en: "Damaged stairs" },
      { pl: "Otwarta studzienka", en: "Open manhole" },
      { pl: "Inny problem z infrastrukturą", en: "Other infrastructure issue" }
    ]
  },
  {
    key: "clean-green",
    pl: "Czystość i zieleń",
    en: "Cleanliness & greenery",
    items: [
      { pl: "Śmieci", en: "Waste" },
      { pl: "Przewrócone drzewo", en: "Fallen tree" },
      { pl: "Zalana przestrzeń", en: "Flooded area" },
      { pl: "Przepełniony kosz", en: "Overflowing bin" },
      { pl: "Dzikie wysypisko", en: "Illegal dumping" },
      { pl: "Uszkodzona zieleń", en: "Damaged greenery" },
      { pl: "Niebezpieczna gałąź", en: "Dangerous branch" },
      { pl: "Inny problem z czystością lub zielenią", en: "Other cleanliness or greenery issue" }
    ]
  },
  {
    key: "safety-transport",
    pl: "Bezpieczeństwo i transport",
    en: "Safety & transport",
    items: [
      { pl: "Zablokowany przejazd", en: "Blocked passage" },
      { pl: "Problem z oznakowaniem", en: "Signage issue" },
      { pl: "Utrudnienie komunikacyjne", en: "Transport disruption" },
      { pl: "Niedziałająca sygnalizacja", en: "Traffic light failure" },
      { pl: "Niebezpieczne przejście dla pieszych", en: "Unsafe pedestrian crossing" },
      { pl: "Przeszkoda na drodze rowerowej", en: "Cycle path obstruction" },
      { pl: "Zastawiony chodnik", en: "Obstructed pavement" },
      { pl: "Inny problem z bezpieczeństwem lub transportem", en: "Other safety or transport issue" }
    ]
  },
  {
    key: "public-transport",
    pl: "Komunikacja miejska",
    en: "Public transport",
    items: [
      { pl: "Uszkodzona wiata przystankowa", en: "Damaged bus or tram shelter" },
      { pl: "Nieczytelny rozkład jazdy", en: "Unreadable timetable" },
      { pl: "Niedziałająca tablica odjazdów", en: "Departure display failure" },
      { pl: "Brak dostępności przystanku", en: "Inaccessible stop" },
      { pl: "Uszkodzony biletomat", en: "Ticket machine failure" },
      { pl: "Inny problem z komunikacją miejską", en: "Other public transport issue" }
    ]
  },
  {
    key: "water-utilities",
    pl: "Woda i kanalizacja",
    en: "Water and drainage",
    items: [
      { pl: "Wyciek wody", en: "Water leak" },
      { pl: "Zatkany odpływ uliczny", en: "Blocked street drain" },
      { pl: "Uszkodzona studzienka", en: "Damaged manhole" },
      { pl: "Zalanie ulicy", en: "Flooded street" },
      { pl: "Uszkodzone poidełko", en: "Damaged drinking fountain" },
      { pl: "Inny problem z wodą lub kanalizacją", en: "Other water or drainage issue" }
    ]
  },
  {
    key: "environment",
    pl: "Środowisko i hałas",
    en: "Environment and noise",
    items: [
      { pl: "Uciążliwy hałas", en: "Excessive noise" },
      { pl: "Podejrzenie spalania odpadów", en: "Suspected waste burning" },
      { pl: "Zanieczyszczenie wody", en: "Water pollution" },
      { pl: "Uciążliwy zapach", en: "Unpleasant odour" },
      { pl: "Zanieczyszczenie terenu", en: "Land pollution" },
      { pl: "Inny problem środowiskowy", en: "Other environmental issue" }
    ]
  },
  {
    key: "accessibility",
    pl: "Dostępność przestrzeni",
    en: "Accessibility",
    items: [
      { pl: "Brak podjazdu", en: "Missing access ramp" },
      { pl: "Uszkodzony podjazd", en: "Damaged access ramp" },
      { pl: "Zbyt wysoki krawężnik", en: "Kerb too high" },
      { pl: "Zablokowane dojście do budynku", en: "Blocked building access" },
      { pl: "Niedziałająca winda publiczna", en: "Public lift failure" },
      { pl: "Inna bariera dostępności", en: "Other accessibility barrier" }
    ]
  },
  {
    key: "recreation",
    pl: "Sport i rekreacja",
    en: "Sport and recreation",
    items: [
      { pl: "Uszkodzone urządzenie na placu zabaw", en: "Damaged playground equipment" },
      { pl: "Uszkodzona siłownia plenerowa", en: "Damaged outdoor gym equipment" },
      { pl: "Uszkodzone boisko", en: "Damaged sports court" },
      { pl: "Uszkodzone ogrodzenie obiektu", en: "Damaged facility fence" },
      { pl: "Niebezpieczna nawierzchnia placu zabaw", en: "Unsafe playground surface" },
      { pl: "Inny problem z obiektem rekreacyjnym", en: "Other recreation facility issue" }
    ]
  }
] as const;

export type CategoryKey = (typeof categories)[number]["key"];

export type StoredReport = {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  lat: number;
  lng: number;
  createdAt: string;
  status: "Przyjęte";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  impacts?: string[];
  photoUrl?: string | null;
};

export function isStoredReport(value: unknown): value is StoredReport {
  if (!value || typeof value !== "object") return false;
  const report = value as Record<string, unknown>;
  return typeof report.id === "string" && typeof report.category === "string" &&
    typeof report.subcategory === "string" && typeof report.description === "string" &&
    typeof report.lat === "number" && Number.isFinite(report.lat) && Math.abs(report.lat) <= 90 &&
    typeof report.lng === "number" && Number.isFinite(report.lng) && Math.abs(report.lng) <= 180 &&
    typeof report.createdAt === "string" && !Number.isNaN(Date.parse(report.createdAt)) &&
    report.status === "Przyjęte" &&
    (report.priority === undefined || ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(String(report.priority))) &&
    (report.photoUrl === undefined || report.photoUrl === null ||
      (typeof report.photoUrl === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(report.photoUrl)));
}
