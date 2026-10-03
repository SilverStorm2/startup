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

## Funkcje

- PL/EN
- zgłoszenie problemu
- 3 główne kategorie + podkategorie
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
