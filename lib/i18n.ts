export type Lang = "pl" | "en";

export const copy = {
  pl: {
    navReport: "Zgłoś problem",
    navHow: "Jak działa",
    navFaq: "FAQ",
    eyebrow: "Miejski system zgłoszeń · Kraków",
    heroTitleA: "Widzisz problem?",
    heroTitleB: "Zgłoś go w 60 sekund.",
    heroText:
      "KRK Alert pomaga mieszkańcom szybko opisać problem, zaznaczyć miejsce i przygotować czytelne zgłoszenie.",
    reportNow: "Zgłoś problem",
    emergency: "Nagłe zagrożenie? Zadzwoń 112",
    reportHeading: "Nowe zgłoszenie",
    reportLead: "Zdjęcie, kategoria i lokalizacja — bez konta i bez bazy danych.",
    category: "Kategoria",
    subcategory: "Rodzaj problemu",
    desc: "Krótki opis",
    photo: "Dodaj zdjęcie",
    location: "Lokalizacja",
    useGps: "Użyj mojej lokalizacji",
    submit: "Zapisz zgłoszenie lokalnie",
    status: "Status zgłoszenia",
    recent: "Przykładowe zgłoszenia",
    recentLead: "Prosty carousel pokazujący rodzaj spraw i ich stan.",
    howTitle: "Jak to działa?",
    faqTitle: "Najczęstsze pytania",
    privacyNote:
      "Wersja demo zapisuje zgłoszenia wyłącznie w localStorage Twojej przeglądarki.",
    saved: "Zgłoszenie zapisane lokalnie.",
    reportsCount: "Twoje zgłoszenia"
  },
  en: {
    navReport: "Report an issue",
    navHow: "How it works",
    navFaq: "FAQ",
    eyebrow: "City reporting system · Kraków",
    heroTitleA: "See a problem?",
    heroTitleB: "Report it in 60 seconds.",
    heroText:
      "KRK Alert helps residents quickly describe an issue, mark its location and prepare a clear report.",
    reportNow: "Report an issue",
    emergency: "Immediate danger? Call 112",
    reportHeading: "New report",
    reportLead: "Photo, category and location — no account and no database.",
    category: "Category",
    subcategory: "Issue type",
    desc: "Short description",
    photo: "Add photo",
    location: "Location",
    useGps: "Use my location",
    submit: "Save report locally",
    status: "Report status",
    recent: "Sample reports",
    recentLead: "A simple carousel showing common issues and their status.",
    howTitle: "How does it work?",
    faqTitle: "Frequently asked questions",
    privacyNote:
      "The demo stores reports only in your browser localStorage.",
    saved: "Report saved locally.",
    reportsCount: "Your reports"
  }
} as const;
