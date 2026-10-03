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
  Menu,
  Phone,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import ReportMap from "./ReportMap";
import { categories, StoredReport } from "@/lib/report-types";
import { copy, Lang } from "@/lib/i18n";

const smartImpacts = {
  infrastructure: ["Mobility", "Safety"],
  "clean-green": ["Public space", "Quality of life"],
  "safety-transport": ["Mobility", "Safety", "Crisis response"]
} as const;

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
  ["Co mogę zgłosić?", "Problemy z infrastrukturą, czystością i zielenią oraz bezpieczeństwem i transportem."],
  ["Czy zgłoszenie jest anonimowe?", "Tak. Ten prototyp nie wymaga konta ani danych osobowych."],
  ["Kiedy dzwonić pod 112?", "Gdy istnieje bezpośrednie zagrożenie życia, zdrowia lub bezpieczeństwa."],
  ["Jak działa lokalizacja?", "Możesz użyć GPS albo ręcznie kliknąć mapę i przesunąć pinezkę."],
  ["Gdzie są przechowywane moje zgłoszenia?", "Wyłącznie lokalnie, w localStorage tej przeglądarki."]
];

const faqEn = [
  ["What can I report?", "Infrastructure, cleanliness and greenery, safety and transport issues."],
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
  const [subcategory, setSubcategory] = useState(selectedCategory.items[0][lang]);
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState({ lat: 50.0647, lng: 19.945 });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [saved, setSaved] = useState(false);
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase().startsWith("en") ? "en" : "pl";
    const savedLang = localStorage.getItem("krk-alert-lang") as Lang | null;
    setLang(savedLang ?? browserLang);

    const stored = localStorage.getItem("krk-alert-reports");
    if (stored) {
      try {
        setReports(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    setSubcategory(selectedCategory.items[0][lang]);
  }, [lang, selectedCategory]);


  useEffect(() => {
    const value = `${subcategory} ${description}`.toLowerCase();

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
  }, [subcategory, description]);

  const changeLang = () => {
    const next = lang === "pl" ? "en" : "pl";
    setLang(next);
    localStorage.setItem("krk-alert-lang", next);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const report: StoredReport = {
      id: crypto.randomUUID(),
      category: selectedCategory[lang],
      subcategory,
      description,
      lat: position.lat,
      lng: position.lng,
      createdAt: new Date().toISOString(),
      status: "Przyjęte"
    };
    const next = [report, ...reports];
    setReports(next);
    localStorage.setItem("krk-alert-reports", JSON.stringify(next));
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
            <button onClick={changeLang} className="icon-button" aria-label="Change language">
              <Languages size={18} />
              <span>{lang.toUpperCase()}</span>
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
              SMARTCITY · {t.eyebrow}
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[.96] tracking-[-.055em] text-white sm:text-6xl lg:text-7xl">
              {t.heroTitleA}<br />
              <span className="text-cyan">{t.heroTitleB}</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              KRK Alert zamienia codzienne obserwacje mieszkańców w uporządkowane dane miejskie:
              zdjęcie, lokalizacja, kategoria, priorytet i wpływ na funkcjonowanie miasta.
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
              <span className="inline-flex items-center gap-2"><ShieldCheck size={17} /> Bez konta</span>
              <span className="inline-flex items-center gap-2"><Clock3 size={17} /> ~60 sekund</span>
              <span className="inline-flex items-center gap-2"><Sparkles size={17} /> Local-first</span>
            </div>
          </div>

          <div className="relative">
            <div className="hero-panel">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[.2em] text-slate-500">KRK live preview</p>
                  <h2 className="mt-1 text-xl font-bold">Kraków · Centrum</h2>
                </div>
                <span className="status-chip status-green">online</span>
              </div>
              <div className="mini-map">
                <span className="road road-a" />
                <span className="road road-b" />
                <span className="road road-c" />
                <span className="mock-pin pin-a"><MapPin size={22} /></span>
                <span className="mock-pin pin-b"><AlertTriangle size={19} /></span>
                <div className="map-card">
                  <span className="text-xs text-slate-500">Nowe zgłoszenie</span>
                  <strong>Dziura w jezdni</strong>
                  <span>Krowodrza · 2 min temu</span>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="metric"><b>03</b><span>nowe</span></div>
                <div className="metric"><b>11</b><span>w toku</span></div>
                <div className="metric"><b>28</b><span>rozwiązane</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="report" className="bg-white py-20 text-slate-900">
        <div className="site-wrap grid gap-10 lg:grid-cols-[.74fr_1.26fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="section-label">01 · REPORT</span>
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
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((item) => (
                    <option key={item.key} value={item.key}>{item[lang]}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>{t.subcategory}</span>
                <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
                  {selectedCategory.items.map((item) => (
                    <option key={item.pl} value={item[lang]}>{item[lang]}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="smart-panel mt-5">
              <div>
                <span className="smart-label">Smart classification</span>
                <strong>{selectedCategory[lang]} → {subcategory}</strong>
              </div>
              <div>
                <span className="smart-label">Priority</span>
                <strong className={`priority priority-${priority.toLowerCase()}`}>{priority}</strong>
              </div>
              <div>
                <span className="smart-label">City impact</span>
                <div className="impact-list">
                  {smartImpacts[category as keyof typeof smartImpacts].map((impact) => (
                    <span key={impact}>{impact}</span>
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
                required
              />
            </label>

            <div className="mt-5">
              <span className="field-label">{t.photo}</span>
              <label className="upload-box">
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPhotoUrl(URL.createObjectURL(file));
                  }}
                />
                {photoUrl ? (
                  <img src={photoUrl} alt="Podgląd zgłoszenia" className="h-44 w-full rounded-2xl object-cover" />
                ) : (
                  <>
                    <FileImage size={28} />
                    <span>{lang === "pl" ? "Kliknij, aby dodać zdjęcie" : "Click to add a photo"}</span>
                    <small>JPG / PNG / HEIC</small>
                  </>
                )}
              </label>
            </div>

            <div className="mt-6">
              <span className="field-label">{t.location}</span>
              <ReportMap value={position} onChange={setPosition} label={t.useGps} />
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
              </div>
              <button className="primary-button" type="submit">
                <Check size={18} />
                {t.submit}
              </button>
            </div>

            {saved && <div className="success-toast">{t.saved}</div>}
          </form>
        </div>
      </section>

      <section className="bg-mist py-20 text-slate-900">
        <div className="site-wrap">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="section-label">02 · CITY CASES</span>
              <h2 className="section-title">{t.recent}</h2>
              <p className="section-lead">{t.recentLead}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollCarousel(-1)} className="round-arrow" aria-label="Previous">
                <ChevronLeft />
              </button>
              <button onClick={() => scrollCarousel(1)} className="round-arrow" aria-label="Next">
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
                    <span className="status-chip">{item.status}</span>
                  </div>
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <button className="mt-5 inline-flex items-center gap-2 text-sm font-bold">
                    Szczegóły <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="bg-ink py-20">
        <div className="site-wrap">
          <span className="section-label text-cyan">03 · FLOW</span>
          <h2 className="section-title text-white">{t.howTitle}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["01", "Citizen input", "Mieszkaniec dodaje zdjęcie, opis i lokalizację problemu."],
              ["02", "Structured urban data", "System porządkuje kategorię, priorytet i wpływ na miasto."],
              ["03", "Faster city response", "Tak przygotowane zgłoszenia mogą być szybciej filtrowane i obsługiwane."]
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
          <span className="section-label">04 · SMARTCITY FIT</span>
          <h2 className="section-title">Jak KRK Alert pomaga miastu działać lepiej?</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Communication", "Jeden prosty kanał zgłoszeń mieszkańców."],
              ["Urban data", "Ustandaryzowane dane: kategoria, lokalizacja, priorytet i status."],
              ["Public services", "Problemy są uporządkowane według miejskich obszarów działania."],
              ["Crisis response", "Szybsze oznaczanie zgłoszeń wymagających pilnej reakcji."]
            ].map(([title, body]) => (
              <div key={title} className="fit-card">
                <span>SMARTCITY</span>
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
            <span className="section-label">05 · FAQ</span>
            <h2 className="section-title">{t.faqTitle}</h2>
            <p className="mt-4 max-w-sm text-slate-500">
              Proste odpowiedzi bez dodatkowego konta i formularzy.
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
              {reports.slice(0, 4).map((report) => (
                <div key={report.id} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <b>{report.subcategory}</b>
                    <span className="status-chip">{report.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{report.description}</p>
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
            <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
            <Link href="/cookies">Cookies / localStorage</Link>
            <a href="tel:112">112</a>
            <a href="tel:986">Straż Miejska 986</a>
          </div>
        </div>
      </footer>

      <div className="mobile-dock md:hidden">
        <a href="#report"><MapPin size={18}/><span>Zgłoś</span></a>
        <a href="tel:112"><Phone size={18}/><span>112</span></a>
        <button onClick={changeLang}><Languages size={18}/><span>{lang.toUpperCase()}</span></button>
      </div>
    </main>
  );
}
