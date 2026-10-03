# KRK Alert — SmartCity

Hackathonowy prototyp dla kategorii SmartCity. KRK Alert zamienia zgłoszenia mieszkańców w uporządkowane dane miejskie, które mogą wspierać szybszą obsługę problemów, komunikację z mieszkańcami i reagowanie kryzysowe.

## Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- MapLibre GL JS
- OpenStreetMap raster tiles — tylko jako proste źródło mapy dla demo
- localStorage
- Vercel
- brak bazy danych
- brak logowania

## Uruchomienie

```bash
npm install
npm run dev
```

Otwórz `http://localhost:3000`.

## Weryfikacja i zapis

`npm run lint` sprawdza typy TypeScript, a `npm run build` tworzy wersję produkcyjną.
Jeśli działający serwer blokuje katalog `.next`, w PowerShell użyj:

```powershell
$env:KRK_BUILD_DIR = '.next-check'
npm run build
```

Zgłoszenia zapisują opis, współrzędne, datę, status, priorytet, wpływ na miasto
i opcjonalne zdjęcie JPG/PNG/WebP (plik wejściowy do 20 MB). Zdjęcia są zmniejszane
do maksymalnie 768 px i zapisywane jako JPEG z jakością 80%. Pozostają w localStorage.
W razie braku miejsca formularz zachowuje dane i wyświetla błąd zapisu.
Priorytet jest sugestią opartą na prostych regułach tekstowych.

## Analiza zdjęcia przez Hugging Face

Endpoint Next.js POST /api/analyze-photo wysyła rzeczywisty obraz do publicznego
routera https://router.huggingface.co/v1/chat/completions. Model vision:
google/gemma-3-27b-it:deepinfra (obsługuje wejście image oraz structured output).
Nie używamy lokalnego CLIP, reguł do rozpoznawania zdjęć ani dedykowanego endpointu.

Umieść HF_TOKEN w .env.local w katalogu głównym projektu. Token musi mieć
uprawnienie „Make calls to Inference Providers”. Nigdy nie używaj NEXT_PUBLIC_.
Opcjonalnie HF_VISION_MODEL pozwala wybrać inny kompatybilny model vision z dostawcą.
Po zmianie środowiska uruchom ponownie npm run dev.

Przeglądarka zmniejsza zdjęcie do JPEG o maksymalnym wymiarze 768 px.
Backend sprawdza format i limit 2 MB, ponownie zmniejsza obraz i usuwa metadane.
Model otrzymuje obraz i katalog istniejących kategorii/rodzajów problemów,
bez opisu użytkownika, lokalizacji i zgłoszeń. Wynik JSON jest walidowany względem katalogu.
Niejasne zdjęcie może nie dać propozycji. Pola formularza zmieniają się dopiero
po kliknięciu „Zastosuj propozycję”. Ręczny wybór działa także po błędzie HF.

Publiczne Inference Providers korzysta z dostępnych kredytów konta HF;
nie gwarantuje nieograniczonej darmowej analizy. Nie tworzymy płatnego dedykowanego
endpointu ani nie aktywujemy płatności. Brak kredytów, tokenu, uprawnień, limit,
timeout i niepoprawna odpowiedź powodują jawny błąd, bez fikcyjnej analizy AI.
Zdjęcie trafia do HF i dostawcy modelu; aplikacja nie zapisuje go na serwerze.

Testy: npm run test:photo. Test rzeczywistego API z publiczną grafiką projektu:
node --env-file=.env.local scripts/test-photo-analysis.mjs --live.
Hosting musi obsługiwać endpoint Next.js Node.js oraz wychodzące HTTPS.

## Funkcje

- PL/EN
- zgłoszenie problemu
- 8 kategorii i 54 rodzaje problemów, w języku polskim i angielskim
- zdjęcie z podglądem
- MapLibre + GPS + draggable marker / kliknięcie mapy
- status zgłoszenia
- zapis zgłoszeń w localStorage
- carousel przykładowych zgłoszeń
- FAQ accordion
- telefoniczne CTA: 112 i 986
- polityka prywatności
- informacja o cookies/localStorage
- własne logo i grafiki
- Open Graph 1200 × 630 dla Facebook / WhatsApp
- mobile bottom navigation

## Elementy w stylu shadcn

Mockup korzysta z lekkich własnych komponentów wizualnych odpowiadających typowym elementom shadcn:
Button, Card, Select, Accordion, Badge i Toast. Dzięki temu projekt nie wymaga dodatkowych zależności Radix tylko dla makiety.

## Mapa

MapLibre GL JS jest open source. W tym prototypie użyte są publiczne kafelki OpenStreetMap. Przy realnym wdrożeniu produkcyjnym należy wybrać dostawcę kafelków zgodnego z planowanym ruchem i jego warunkami użytkowania.

## Dane

Wersja demo nie wysyła zgłoszeń do urzędu. Dane formularza są przechowywane wyłącznie w `localStorage`.

## Open Graph

Grafika: `public/og/krk-alert-og.png`

Po wdrożeniu zmień w `app/layout.tsx`:

```ts
metadataBase: new URL("https://krk-alert.vercel.app")
```

na właściwy adres Vercel / domenę.


## Korelacja z challenge SmartCity

KRK Alert odpowiada bezpośrednio na cztery obszary zadania:

- **communication with citizens** — prosty kanał zgłoszeń dla mieszkańców,
- **urban data** — każde zgłoszenie ma kategorię, lokalizację, priorytet i status,
- **public services** — dane są porządkowane według obszarów działania miasta,
- **crisis response** — pilne zdarzenia mogą otrzymać wyższy priorytet.

### Pitch

**KRK Alert turns everyday citizen observations into structured urban data.**

Residents report an issue using a photo, GPS location and short description.  
The system standardizes the report, assigns category, priority and city impact, making urban issues easier to filter, understand and act on.

**See it. Report it. Improve the city.**
