import Link from "next/link";

export const metadata = { title: "Polityka prywatności" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-16 text-slate-900">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-slate-500">← KRK Alert</Link>
        <h1 className="mt-8 text-4xl font-black tracking-tight">Polityka prywatności</h1>
        <div className="mt-8 space-y-5 leading-7 text-slate-600">
          <p>KRK Alert jest prototypem demonstracyjnym. Nie wymaga zakładania konta ani podawania danych osobowych.</p>
          <p>Zgłoszenia tworzone w wersji demo są zapisywane lokalnie w pamięci przeglądarki (localStorage) i nie są przesyłane do administratora ani do urzędu.</p>
          <p>Jeżeli użytkownik wybierze funkcję lokalizacji, przeglądarka poprosi o zgodę na dostęp do położenia. Współrzędne są używane wyłącznie w formularzu zgłoszenia i zapisywane lokalnie razem ze zgłoszeniem.</p>
          <p>Zdjęcia wybrane w formularzu służą do podglądu w bieżącej sesji. Prototyp nie wysyła ich na zewnętrzny serwer.</p>
          <p>Ta treść jest wzorem do prototypu hackathonowego i przed produkcyjnym wdrożeniem powinna zostać dostosowana do faktycznego sposobu przetwarzania danych.</p>
        </div>
      </article>
    </main>
  );
}
