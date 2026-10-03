import Link from "next/link";

export const metadata = { title: "Cookies i localStorage" };

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-16 text-slate-900">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-slate-500">← KRK Alert</Link>
        <h1 className="mt-8 text-4xl font-black tracking-tight">Cookies i localStorage</h1>
        <div className="mt-8 space-y-5 leading-7 text-slate-600">
          <p>Prototyp KRK Alert nie korzysta z cookies reklamowych ani analitycznych.</p>
          <p>localStorage jest używany do zapisania języka interfejsu oraz demonstracyjnych zgłoszeń użytkownika na jego urządzeniu.</p>
          <p>Dane można usunąć przez wyczyszczenie danych witryny w ustawieniach przeglądarki.</p>
        </div>
      </article>
    </main>
  );
}
