"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Lang } from "@/lib/i18n";
const content = {
 privacy: {
  pl: { title: "Polityka prywatności", paragraphs: ["KRK Alert jest prototypem demonstracyjnym. Nie wymaga konta ani danych osobowych.", "Zgłoszenia, opisy, zdjęcia i lokalizacje są przechowywane w pamięci przeglądarki. Nie są wysyłane do urzędu. Wybrane zdjęcie jest także przesyłane do serwera aplikacji wyłącznie na czas analizy.", "Przy użyciu GPS przeglądarka poprosi o dostęp do położenia. Współrzędne są zapisywane razem ze zgłoszeniem.", "Mapa pobiera kafelki z OpenStreetMap. Dostawca otrzymuje dane połączenia, takie jak adres IP, oraz informacje o wyświetlanym obszarze mapy.", "Zmniejszone zdjęcie jest przesyłane przez serwer aplikacji do Hugging Face Inference Providers i dostawcy modelu DeepInfra w celu analizy. Aplikacja nie zapisuje go trwale na serwerze. Przetwarzanie u dostawców podlega ich zasadom prywatności. Propozycję zatwierdza użytkownik.", "Dane lokalne można usunąć, czyszcząc dane witryny w ustawieniach przeglądarki."] },
  en: { title: "Privacy policy", paragraphs: ["KRK Alert is a demonstration prototype. No account or personal details are required.", "Reports, descriptions, photos and locations are stored in your browser. They are not sent to city services. The selected photo is also sent to the application server temporarily for analysis.", "When you use GPS, your browser asks for location access. Coordinates are saved with the report.", "The map downloads tiles from OpenStreetMap. The provider receives connection data, such as your IP address, and information about the displayed map area.", "The resized photo is sent through the application server to Hugging Face Inference Providers and model provider DeepInfra for analysis. The application does not permanently store it on the server. Provider processing is subject to their privacy policies. The user approves the suggestion.", "You can delete local data by clearing this website's data in your browser settings."] }
 },
 cookies: {
  pl: { title: "Pliki cookie i pamięć przeglądarki", paragraphs: ["KRK Alert nie korzysta z reklamowych ani analitycznych plików cookie.", "Pamięć przeglądarki (localStorage) przechowuje język interfejsu i zgłoszenia, w tym zdjęcia i lokalizacje, na Twoim urządzeniu.", "Dane pozostają po odświeżeniu strony. Możesz je usunąć, czyszcząc dane witryny w ustawieniach przeglądarki."] },
  en: { title: "Cookies and browser storage", paragraphs: ["KRK Alert does not use advertising or analytics cookies.", "Browser storage (localStorage) keeps your interface language and reports, including photos and locations, on your device.", "Data remains after refreshing the page. You can delete it by clearing this website's data in your browser settings."] }
 }
};
export default function InformationPage({ kind }: { kind: keyof typeof content }) {
 const [lang, setLang] = useState<Lang>("pl");
 useEffect(() => {
  const requested = new URLSearchParams(window.location.search).get("lang");
  let stored: string | null = null;
  try { stored = localStorage.getItem("krk-alert-lang"); } catch {}
  setLang(requested === "pl" || requested === "en" ? requested : stored === "en" ? "en" : "pl");
 }, []);
 const text = content[kind][lang];
 useEffect(() => { document.documentElement.lang = lang; document.title = text.title + " | KRK Alert"; }, [lang, text.title]);
 const changeLanguage = () => {
  const next = lang === "pl" ? "en" : "pl"; setLang(next);
  try { localStorage.setItem("krk-alert-lang", next); } catch {}
  window.history.replaceState(null, "", "?lang=" + next);
 };
 return <main className="min-h-screen bg-white px-5 py-16 text-slate-900"><article className="mx-auto max-w-3xl">
  <div className="flex items-center justify-between gap-4"><Link href="/" className="text-sm font-bold text-slate-500">← {lang === "pl" ? "Wróć do KRK Alert" : "Back to KRK Alert"}</Link><button onClick={changeLanguage} className="rounded-full border px-4 py-2 text-sm" aria-label={lang === "pl" ? "Zmień język na angielski" : "Switch to Polish"}><b className={lang === "pl" ? "text-teal-700" : ""}>PL</b> / <b className={lang === "en" ? "text-teal-700" : ""}>EN</b></button></div>
  <h1 className="mt-8 text-3xl font-bold tracking-tight">{text.title}</h1><div className="mt-8 space-y-5 leading-7 text-slate-600">{text.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
 </article></main>;
}
