export type Lang = "pl" | "en";

export const copy = {
  pl: {
    navReport: "Zgłoś problem",
    navHow: "Jak działa",
    navFaq: "Pytania i odpowiedzi",
    eyebrow: "Miejski system zgłoszeń · Kraków",
    heroTitleA: "Widzisz problem?",
    heroTitleB: "Zgłoś go w 60 sekund.",
    heroText:
      "KRK Alert pomaga mieszkańcom szybko opisać problem, zaznaczyć miejsce i przygotować czytelne zgłoszenie.",
    reportNow: "Zgłoś problem",
    emergency: "Nagłe zagrożenie? Zadzwoń 112",
    reportHeading: "Nowe zgłoszenie",
    reportLead: "Opisz problem, wybierz kategorię i wskaż miejsce. Możesz też dodać zdjęcie.",
    category: "Kategoria",
    subcategory: "Rodzaj problemu",
    desc: "Krótki opis",
    photo: "Dodaj zdjęcie",
    location: "Lokalizacja",
    useGps: "Użyj mojej lokalizacji",
    submit: "Zapisz zgłoszenie",
    status: "Status zgłoszenia",
    recent: "Przykładowe zgłoszenia",
    recentLead: "Zobacz przykładowe problemy miejskie i opisy zgłoszeń.",
    howTitle: "Jak to działa?",
    faqTitle: "Najczęstsze pytania",
    privacyNote:
      "Wersja demonstracyjna zapisuje zgłoszenia wyłącznie w pamięci Twojej przeglądarki.",
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
    reportLead: "Describe the issue, select a category and mark the location. You can also add a photo.",
    category: "Category",
    subcategory: "Issue type",
    desc: "Short description",
    photo: "Add photo",
    location: "Location",
    useGps: "Use my location",
    submit: "Save report",
    status: "Report status",
    recent: "Sample reports",
    recentLead: "Explore sample city issues and report descriptions.",
    howTitle: "How does it work?",
    faqTitle: "Frequently asked questions",
    privacyNote:
      "The demo stores reports only in your browser's local storage.",
    saved: "Report saved locally.",
    reportsCount: "Your reports"
  }
} as const;
