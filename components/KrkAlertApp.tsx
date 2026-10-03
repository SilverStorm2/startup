"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileImage,
  Languages,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import ReportMap from "./ReportMap";
import { categories, CategoryKey, isStoredReport, StoredReport } from "@/lib/report-types";
import { copy, Lang } from "@/lib/i18n";

const priorityLabels = {
  LOW: { pl: "Niski", en: "Low" },
  MEDIUM: { pl: "Średni", en: "Medium" },
  HIGH: { pl: "Wysoki", en: "High" },
  CRITICAL: { pl: "Krytyczny", en: "Critical" }
};
const impactLabels: Record<string, Record<Lang, string>> = {
  Mobility: { pl: "Mobilność", en: "Mobility" },
  Safety: { pl: "Bezpieczeństwo", en: "Safety" },
  "Public space": { pl: "Przestrzeń publiczna", en: "Public space" },
  "Quality of life": { pl: "Jakość życia", en: "Quality of life" },
  "Crisis response": { pl: "Reagowanie kryzysowe", en: "Crisis response" }
};
const showcaseEnglish: Record<string, { title: string; status: string }> = {
  "/reports/pothole.svg": { title: "Damaged road", status: "Under review" },
  "/reports/streetlight.svg": { title: "Streetlight failure", status: "In progress" },
  "/reports/flood.svg": { title: "Flooded street", status: "Resolved" }
};

const smartImpacts = {
  infrastructure: ["Mobility", "Safety"],
  "clean-green": ["Public space", "Quality of life"],
  "safety-transport": ["Mobility", "Safety", "Crisis response"],
  "public-transport": ["Mobility", "Quality of life"],
  "water-utilities": ["Public space", "Safety", "Crisis response"],
  environment: ["Public space", "Quality of life"],
  accessibility: ["Mobility", "Quality of life"],
  recreation: ["Public space", "Safety", "Quality of life"]
} as const satisfies Record<CategoryKey, readonly string[]>;

const showcase = [
  {
    image: "/reports/pothole.svg",
    title: "Uszkodzona jezdnia",
    place: "Krowodrza",
    status: "W weryfikacji"
  },
  {
    image: "/reports/streetlight.svg",
    title: "Niedziałająca latarnia",
    place: "Podgórze",
    status: "W realizacji"
  },
  {
    image: "/reports/flood.svg",
    title: "Zalana ulica",
    place: "Grzegórzki",
    status: "Rozwiązane"
  }
];

const faqPl = [
  ["Co mogę zgłosić?", "Problemy z infrastrukturą, czystością i zielenią, bezpieczeństwem, transportem, wodą i kanalizacją, środowiskiem, dostępnością oraz obiektami rekreacyjnymi."],
  ["Czy zgłoszenie jest anonimowe?", "Tak. Ten prototyp nie wymaga konta ani danych osobowych."],
  ["Kiedy dzwonić pod 112?", "Gdy istnieje bezpośrednie zagrożenie życia, zdrowia lub bezpieczeństwa."],
  ["Jak działa lokalizacja?", "Możesz użyć GPS albo ręcznie kliknąć mapę i przesunąć pinezkę."],
  ["Gdzie są przechowywane moje zgłoszenia?", "Wyłącznie lokalnie, w pamięci tej przeglądarki."]
];

const faqEn = [
  ["What can I report?", "Infrastructure, cleanliness and greenery, safety, transport, water and drainage, environment, accessibility and recreation facility issues."],
  ["Is the report anonymous?", "Yes. This prototype does not require an account or personal details."],
  ["When should I call 112?", "When there is an immediate threat to life, health or safety."],
  ["How does location work?", "Use GPS or click the map and drag the marker manually."],
  ["Where are my reports stored?", "Only locally, in this browser's localStorage."]
];

export default function KrkAlertApp() {
  const [lang, setLang] = useState<Lang>("pl");
  const t = copy[lang];
  const [category, setCategory] = useState("infrastructure");
  const selectedCategory = useMemo(
    () => categories.find((item) => item.key === category) ?? categories[0],
    [category]
  );
  const [subcategoryIndex, setSubcategoryIndex] = useState(0);
  const selectedIssue = selectedCategory.items[subcategoryIndex] ?? selectedCategory.items[0];
  const subcategory = selectedIssue[lang];
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState({ lat: 50.0647, lng: 19.945 });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase().startsWith("en") ? "en" : "pl";
    try {
      const savedLang = localStorage.getItem("krk-alert-lang");
      setLang(savedLang === "pl" || savedLang === "en" ? savedLang : browserLang);
      const stored = localStorage.getItem("krk-alert-reports");
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) setReports(parsed.filter(isStoredReport));
    } catch {
      setLang(browserLang);
      setError("storage-read");
    }
  }, []);

  useEffect(() => {
    const value = `${selectedIssue.pl} ${selectedIssue.en} ${description}`.toLowerCase();

    if (
      value.includes("zal") ||
      value.includes("drzew") ||
      value.includes("blocked") ||
      value.includes("flood") ||
      value.includes("zagro")
    ) {
      setPriority("HIGH");
    } else if (
      value.includes("transport") ||
      value.includes("latarnia") ||
      value.includes("streetlight")
    ) {
      setPriority("MEDIUM");
    } else {
      setPriority("LOW");
    }
  }, [selectedIssue, description]);

  const changeLang = () => {
    const next = lang === "pl" ? "en" : "pl";
    setLang(next);
    setError("");
    try { localStorage.setItem("krk-alert-lang", next); } catch {}
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "pl" ? "KRK Alert — zgłoś problem w Krakowie" : "KRK Alert — report an issue in Kraków";
  }, [lang]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!description.trim() || photoLoading) return;
    setError("");
    const report: StoredReport = {
      id: crypto.randomUUID(),
      category: selectedCategory[lang],
      subcategory,
      description: description.trim(),
      priority,
      impacts: [...smartImpacts[category as keyof typeof smartImpacts]],
      photoUrl,
      lat: position.lat,
      lng: position.lng,
      createdAt: new Date().toISOString(),
      status: "Przyjęte"
    };
    const next = [report, ...reports];
    try {
      localStorage.setItem("krk-alert-reports", JSON.stringify(next));
    } catch {
      setError(lang === "pl" ? "Nie udało się zapisać. Pamięć może być pełna lub niedostępna. Spróbuj bez zdjęcia." : "Could not save. Storage may be full or unavailable. Try without the photo.");
      return;
    }
    setReports(next);
    setPhotoUrl(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
    setSaved(true);
    setDescription("");
    window.setTimeout(() => setSaved(false), 3500);
  };

  const scrollCarousel = (direction: -1 | 1) => {
    carouselRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  };

  const faq = lang === "pl" ? faqPl : faqEn;

  return (
    <main>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <div className="site-wrap flex h-18 items-center justify-between gap-5 py-4">
          <a href="#top" className="flex items-center gap-3">
            <Image src="/brand/logo-krk-alert.svg" alt="KRK Alert" width={158} height={42} priority />
          </a>
          <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
            <a href="#report" className="hover:text-white">{t.navReport}</a>
            <a href="#how" className="hover:text-white">{t.navHow}</a>
            <a href="#faq" className="hover:text-white">{t.navFaq}</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={changeLang} className="icon-button" aria-label={lang === "pl" ? "Zmień język na angielski" : "Switch to Polish"}>
              <Languages size={18} />
              <span><b className={lang === "pl" ? "text-cyan" : ""}>PL</b> / <b className={lang === "en" ? "text-cyan" : ""}>EN</b></span>
            </button>
            <a href="#report" className="primary-button hidden sm:inline-flex">
              {t.navReport}
            </a>
          </div>
        </div>
      </header>

      <section id="top" className="hero-grid overflow-hidden">
        <div className="site-wrap grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <div className="eyebrow">
              <span className="pulse-dot" />
              {lang === "pl" ? "Inteligentne miasto" : "Smart city"} · {t.eyebrow}
            </div>
            <h1 className="mt-6 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t.heroTitleA}<br />
              <span className="text-cyan">{t.heroTitleB}</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              {t.heroText}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#report" className="primary-button">
                <MapPin size={18} />
                {t.reportNow}
              </a>
              <a href="tel:112" className="danger-button">
                <Phone size={18} />
                {t.emergency}
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-5 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={17} /> {lang === "pl" ? "Bez konta" : "No account"}</span>
              <span className="inline-flex items-center gap-2"><Clock3 size={17} /> {lang === "pl" ? "~60 sekund" : "~60 seconds"}</span>
              <span className="inline-flex items-center gap-2"><Sparkles size={17} /> {lang === "pl" ? "Zapis na urządzeniu" : "Stored on your device"}</span>
            </div>
          </div>

          <div className="relative">
            <div className="hero-panel">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[.2em] text-slate-500">{lang === "pl" ? "Podgląd demo" : "Demo preview"}</p>
                  <h2 className="mt-1 text-xl font-bold">{lang === "pl" ? "Kraków · Centrum" : "Kraków · City centre"}</h2>
                </div>
                <span className="status-chip status-green">demo</span>
              </div>
              <div className="mini-map">
                <span className="road road-a" />
                <span className="road road-b" />
                <span className="road road-c" />
                <span className="mock-pin pin-a"><MapPin size={22} /></span>
                <span className="mock-pin pin-b"><AlertTriangle size={19} /></span>
                <div className="map-card">
                  <span className="text-xs text-slate-500">{lang === "pl" ? "Nowe zgłoszenie" : "New report"}</span>
                  <strong>{lang === "pl" ? "Dziura w jezdni" : "Road damage"}</strong>
                  <span>{lang === "pl" ? "Krowodrza · 2 min temu" : "Krowodrza · 2 min ago"}</span>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="metric"><b>03</b><span>{lang === "pl" ? "nowe" : "new"}</span></div>
                <div className="metric"><b>11</b><span>{lang === "pl" ? "w toku" : "in progress"}</span></div>
                <div className="metric"><b>28</b><span>{lang === "pl" ? "rozwiązane" : "resolved"}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="report" className="bg-white py-20 text-slate-900">
        <div className="site-wrap grid gap-10 lg:grid-cols-[.74fr_1.26fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="section-label">01 · {lang === "pl" ? "Zgłoszenie" : "Report"}</span>
            <h2 className="section-title">{t.reportHeading}</h2>
            <p className="section-lead">{t.reportLead}</p>

            <div className="mt-8 space-y-3">
              {["Przyjęte", "Weryfikacja", "W realizacji", "Rozwiązane"].map((item, idx) => (
                <div key={item} className="timeline-item">
                  <span className={idx === 0 ? "timeline-dot active" : "timeline-dot"}>{idx + 1}</span>
                  <span>{lang === "pl" ? item : ["Received","Verification","In progress","Resolved"][idx]}</span>
                </div>
              ))}
            </div>

            <div className="privacy-card mt-8">
              <ShieldCheck size={20} />
              <p>{t.privacyNote}</p>
            </div>
          </div>

          <form onSubmit={submit} className="report-card">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="field">
                <span>{t.category}</span>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setSubcategoryIndex(0); }}>
                  {categories.map((item) => (
                    <option key={item.key} value={item.key}>{item[lang]}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>{t.subcategory}</span>
                <select value={subcategoryIndex} onChange={(e) => setSubcategoryIndex(Number(e.target.value))}>
                  {selectedCategory.items.map((item, index) => (
                    <option key={item.pl} value={index}>{item[lang]}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="smart-panel mt-5">
              <div>
                <span className="smart-label">{lang === "pl" ? "Klasyfikacja regułowa" : "Rule-based classification"}</span>
                <strong>{selectedCategory[lang]} → {subcategory}</strong>
              </div>
              <div>
                <span className="smart-label">{lang === "pl" ? "Priorytet" : "Priority"}</span>
                <strong className={`priority priority-${priority.toLowerCase()}`}>{priorityLabels[priority][lang]}</strong>
              </div>
              <div>
                <span className="smart-label">{lang === "pl" ? "Wpływ na miasto" : "City impact"}</span>
                <div className="impact-list">
                  {smartImpacts[category as keyof typeof smartImpacts].map((impact) => (
                    <span key={impact}>{impactLabels[impact][lang]}</span>
                  ))}
                </div>
              </div>
            </div>

            <label className="field mt-5">
              <span>{t.desc}</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={lang === "pl" ? "Np. duża dziura przy prawym pasie..." : "e.g. large pothole near the right lane..."}
                rows={4}
                maxLength={2000}
                required
              />
            </label>

            <div className="mt-5">
              <span className="field-label">{t.photo}</span>
              <label className="upload-box">
                <input
                  ref={photoInputRef}
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024) {
                      setError(lang === "pl" ? "Wybierz JPG, PNG lub WebP do 2 MB." : "Choose JPG, PNG or WebP up to 2 MB.");
                      e.target.value = "";
                      return;
                    }
                    setPhotoLoading(true);
                    setError("");
                    const reader = new FileReader();
                    reader.onload = () => { setPhotoUrl(reader.result as string); setPhotoLoading(false); };
                    reader.onerror = () => { setError(lang === "pl" ? "Nie można odczytać zdjęcia." : "Cannot read photo."); setPhotoLoading(false); };
                    reader.readAsDataURL(file);
                  }}
                />
                {photoUrl ? (
                  <img src={photoUrl} alt={lang === "pl" ? "Podgląd zgłoszenia" : "Report preview"} className="h-44 w-full rounded-2xl object-cover" />
                ) : (
                  <>
                    <FileImage size={28} />
                    <span>{lang === "pl" ? "Kliknij, aby dodać zdjęcie" : "Click to add a photo"}</span>
                    <small>JPG / PNG / WebP · {lang === "pl" ? "do 2 MB" : "up to 2 MB"}</small>
                  </>
                )}
              </label>
              {photoUrl && <button type="button" className="mt-2 text-sm underline" onClick={() => { setPhotoUrl(null); if (photoInputRef.current) photoInputRef.current.value = ""; }}>{lang === "pl" ? "Usuń zdjęcie" : "Remove photo"}</button>}
            </div>

            <div className="mt-6">
              <span className="field-label">{t.location}</span>
              <ReportMap value={position} onChange={setPosition} label={t.useGps} lang={lang} />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
              </div>
              <button className="primary-button" type="submit" disabled={photoLoading}>
                <Check size={18} />
                {t.submit}
              </button>
            </div>

            {error && <p role="alert" className="mt-4 text-sm text-red-700">{error === "storage-read" ? (lang === "pl" ? "Nie można odczytać lokalnych danych." : "Cannot read local data.") : error}</p>}
            {saved && <div role="status" className="success-toast">{t.saved}</div>}
          </form>
        </div>
      </section>

      <section className="bg-mist py-20 text-slate-900">
        <div className="site-wrap">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="section-label">02 · {lang === "pl" ? "Przykłady" : "City cases"}</span>
              <h2 className="section-title">{t.recent}</h2>
              <p className="section-lead">{t.recentLead}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollCarousel(-1)} className="round-arrow" aria-label={lang === "pl" ? "Poprzednie zgłoszenia" : "Previous reports"}>
                <ChevronLeft />
              </button>
              <button onClick={() => scrollCarousel(1)} className="round-arrow" aria-label={lang === "pl" ? "Następne zgłoszenia" : "Next reports"}>
                <ChevronRight />
              </button>
            </div>
          </div>

          <div ref={carouselRef} className="carousel mt-10">
            {showcase.map((item) => (
              <article key={item.title} className="case-card">
                <Image src={item.image} alt="" width={640} height={420} className="case-image" />
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <span className="text-xs font-bold uppercase tracking-[.14em] text-alert">{item.place}</span>
                    <span className="status-chip">{lang === "pl" ? item.status : showcaseEnglish[item.image].status}</span>
                  </div>
                  <h3 className="text-xl font-black">{lang === "pl" ? item.title : showcaseEnglish[item.image].title}</h3>
                  <details className="mt-5 text-sm">
                    <summary className="inline-flex cursor-pointer items-center gap-2 font-bold">{lang === "pl" ? "Szczegóły" : "Details"} <ArrowRight size={16} /></summary>
                    <p className="mt-3 text-slate-500">{lang === "pl" ? "Przykładowe zgłoszenie demonstracyjne. Status nie odzwierciedla działań urzędu." : "Sample demo report. The status does not represent city services activity."}</p>
                  </details>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="bg-ink py-20">
        <div className="site-wrap">
          <span className="section-label text-cyan">03 · {lang === "pl" ? "Jak to działa" : "How it works"}</span>
          <h2 className="section-title text-white">{t.howTitle}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["01", lang === "pl" ? "Zgłoszenie mieszkańca" : "Citizen report", lang === "pl" ? "Mieszkaniec dodaje zdjęcie, opis i lokalizację problemu." : "A resident adds a photo, description and location of the issue."],
              ["02", lang === "pl" ? "Uporządkowane dane miejskie" : "Structured urban data", lang === "pl" ? "System porządkuje kategorię, priorytet i wpływ na miasto." : "The system structures the category, priority and impact on the city."],
              ["03", lang === "pl" ? "Sprawniejsza reakcja miasta" : "Faster city response", lang === "pl" ? "Tak przygotowane zgłoszenia mogą być szybciej filtrowane i obsługiwane." : "Structured reports can be filtered and handled more quickly."]
            ].map(([num, title, text]) => (
              <div className="flow-card" key={num}>
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-white py-20 text-slate-900">
        <div className="site-wrap">
          <span className="section-label">04 · {lang === "pl" ? "Korzyści dla miasta" : "Benefits for the city"}</span>
          <h2 className="section-title">{lang === "pl" ? "Jak KRK Alert pomaga miastu działać lepiej?" : "How does KRK Alert help the city work better?"}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              [lang === "pl" ? "Komunikacja" : "Communication", lang === "pl" ? "Jeden prosty kanał zgłoszeń mieszkańców." : "One simple reporting channel for residents."],
              [lang === "pl" ? "Dane miejskie" : "Urban data", lang === "pl" ? "Ustandaryzowane dane: kategoria, lokalizacja, priorytet i status." : "Standardized data: category, location, priority and status."],
              [lang === "pl" ? "Usługi publiczne" : "Public services", lang === "pl" ? "Problemy są uporządkowane według miejskich obszarów działania." : "Issues are organized by city service area."],
              [lang === "pl" ? "Reagowanie kryzysowe" : "Crisis response", lang === "pl" ? "Szybsze oznaczanie zgłoszeń wymagających pilnej reakcji." : "Faster identification of reports requiring an urgent response."]
            ].map(([title, body]) => (
              <div key={title} className="fit-card">
                <span>{lang === "pl" ? "Inteligentne miasto" : "Smart city"}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white py-20 text-slate-900">
        <div className="site-wrap grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <span className="section-label">05 · {lang === "pl" ? "Pytania i odpowiedzi" : "Questions and answers"}</span>
            <h2 className="section-title">{t.faqTitle}</h2>
            <p className="mt-4 max-w-sm text-slate-500">
              {lang === "pl" ? "Proste odpowiedzi bez dodatkowego konta i formularzy." : "Simple answers, without extra accounts or forms."}
            </p>
          </div>
          <div className="faq-stack">
            {faq.map(([q, a]) => (
              <details key={q} className="faq-item">
                <summary>{q}<span>+</span></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {reports.length > 0 && (
        <section className="bg-mist py-14 text-slate-900">
          <div className="site-wrap">
            <h2 className="text-2xl font-black">{t.reportsCount}: {reports.length}</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {reports.map((report) => (
                <div key={report.id} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <b>{categories.flatMap<{ pl: string; en: string }>(item => [...item.items]).find(item => item.pl === report.subcategory || item.en === report.subcategory)?.[lang] ?? report.subcategory}</b>
                    <span className="status-chip">{lang === "pl" ? report.status : "Received"}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{report.description}</p>
                  {report.photoUrl && <img src={report.photoUrl} alt={lang === "pl" ? "Zdjęcie zgłoszenia" : "Report photo"} className="mt-3 h-44 w-full rounded-xl object-cover" />}
                  <p className="mt-3 text-xs text-slate-500">{new Date(report.createdAt).toLocaleString(lang === "pl" ? "pl-PL" : "en-GB")} · {report.lat.toFixed(5)}, {report.lng.toFixed(5)}</p>
                  {report.priority && <span className={`priority mt-3 priority-${report.priority.toLowerCase()}`}>{priorityLabels[report.priority][lang]}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-white/10 bg-ink py-10">
        <div className="site-wrap flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <Image src="/brand/logo-krk-alert.svg" alt="KRK Alert" width={145} height={40} />
          <div className="flex flex-wrap gap-5 text-sm text-slate-400">
            <Link href={`/polityka-prywatnosci?lang=${lang}`}>{lang === "pl" ? "Polityka prywatności" : "Privacy policy"}</Link>
            <Link href={`/cookies?lang=${lang}`}>{lang === "pl" ? "Pliki cookie i pamięć przeglądarki" : "Cookies and browser storage"}</Link>
            <a href="tel:112">112</a>
            <a href="tel:986">{lang === "pl" ? "Straż Miejska 986" : "Municipal guard 986"}</a>
          </div>
        </div>
      </footer>

      <div className="mobile-dock md:hidden">
        <a href="#report"><MapPin size={18}/><span>{lang === "pl" ? "Zgłoś" : "Report"}</span></a>
        <a href="tel:112"><Phone size={18}/><span>112</span></a>
        <button onClick={changeLang} aria-label={lang === "pl" ? "Zmień język na angielski" : "Switch to Polish"}><Languages size={18}/><span><b className={lang === "pl" ? "text-cyan" : ""}>PL</b> / <b className={lang === "en" ? "text-cyan" : ""}>EN</b></span></button>
      </div>
    </main>
  );
}
