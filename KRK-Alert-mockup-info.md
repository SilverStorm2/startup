# KRK Alert — informacje o mockupie

## Cel projektu
KRK Alert to prototyp aplikacji SmartCity dla mieszkańców Krakowa.

Projekt odpowiada na rzeczywisty problem komunikacji mieszkaniec–miasto: zgłaszanie awarii, usterek i problemów miejskich jest często rozproszone, nieczytelne i wymaga wiedzy, gdzie wysłać zgłoszenie.

KRK Alert upraszcza ten proces i zamienia zgłoszenie mieszkańca w uporządkowane dane miejskie.

## Główna funkcja
Mieszkaniec może:

- wybrać kategorię problemu,
- wskazać dokładny typ zgłoszenia,
- dodać opis,
- dodać zdjęcie,
- użyć GPS,
- ręcznie poprawić lokalizację na mapie,
- zapisać zgłoszenie lokalnie,
- zobaczyć status zgłoszenia.

## Kategorie zgłoszeń

### Infrastruktura
- dziura w jezdni,
- uszkodzony chodnik,
- niedziałająca latarnia.

### Czystość i zieleń
- śmieci,
- przewrócone drzewo,
- zalana przestrzeń.

### Bezpieczeństwo i transport
- zablokowany przejazd,
- problem z oznakowaniem,
- utrudnienie komunikacyjne.

## SmartCity
Projekt został dostosowany do kategorii SmartCity i obejmuje:

### Communication with citizens
Jeden prosty kanał zgłoszeń dla mieszkańców.

### Urban data
Każde zgłoszenie może zawierać:
- kategorię,
- lokalizację,
- opis,
- priorytet,
- wpływ na funkcjonowanie miasta,
- status.

### Public services
Zgłoszenia są porządkowane według obszarów działania miasta.

### Crisis response
Pilne zgłoszenia mogą otrzymać wyższy priorytet i być łatwiejsze do wychwycenia.

## Smart classification
Mockup zawiera sekcję inteligentnej klasyfikacji:

- sugerowana kategoria,
- priorytet: LOW / MEDIUM / HIGH / CRITICAL,
- City Impact, np.:
  - Mobility,
  - Safety,
  - Public space,
  - Quality of life,
  - Crisis response.

## Status zgłoszenia
Przewidziane etapy:

1. Przyjęte
2. Weryfikacja
3. W realizacji
4. Rozwiązane

## Mapa i lokalizacja
Projekt wykorzystuje:

- MapLibre GL JS,
- OpenStreetMap jako źródło mapy w wersji demo,
- natywne GPS przeglądarki,
- możliwość kliknięcia mapy,
- draggable marker — ręczne przesuwanie pinezki.

## Dane
Wersja mockupowa:

- nie korzysta z bazy danych,
- nie wymaga logowania,
- zapisuje demonstracyjne zgłoszenia w localStorage,
- zdjęcia nie są wysyłane na zewnętrzny serwer.

## Języki
Interfejs:

- polski,
- angielski,
- przełącznik języka,
- automatyczne wykrycie języka przeglądarki.

## UX / UI
Mockup zawiera:

- pełną responsywność mobile / desktop,
- formularz zgłoszenia,
- carousel przykładowych zgłoszeń,
- FAQ w formie accordion,
- statusy zgłoszeń,
- telefoniczne CTA,
- dolną nawigację mobilną,
- nowoczesny interfejs SmartCity.

## CTA
Najważniejsze akcje:

- Zgłoś problem,
- Użyj mojej lokalizacji,
- Zapisz zgłoszenie lokalnie,
- 112 — nagłe zagrożenie,
- 986 — Straż Miejska.

## Brand
Nazwa:
KRK Alert

Hasło:
Zauważ. Zgłoś. Usprawnij miasto.

Wersja angielska:
See it. Report it. Improve the city.

Mockup zawiera własne:
- logo,
- znak brandowy,
- ikony,
- grafiki przykładowych zgłoszeń.

## Open Graph
Projekt zawiera grafikę Open Graph 1200 × 630 px przeznaczoną m.in. dla:

- Facebook,
- WhatsApp,
- LinkedIn.

Treść:
KRK Alert — Zgłoś. Zlokalizuj. Pomóż miastu reagować.

## RODO i cookies
Mockup zawiera:

- politykę prywatności,
- informację o cookies,
- informację o localStorage.

Wersja demo nie korzysta z:
- cookies reklamowych,
- analityki,
- kont użytkowników.

## Stack technologiczny

- Next.js
- TypeScript
- Tailwind CSS
- MapLibre GL JS
- OpenStreetMap
- localStorage
- Vercel
- lucide-react

## Elementy UI inspirowane shadcn
W projekcie przewidziano lekkie komponenty odpowiadające typowym elementom shadcn:

- Button,
- Card,
- Select,
- Accordion,
- Badge,
- Toast.

## Pitch projektu

KRK Alert turns everyday citizen observations into structured urban data.

Residents can report infrastructure, cleanliness, transport and safety issues using a photo, GPS location and short description.

The system standardizes reports, assigns category, priority and city impact, making urban issues easier to filter, understand and act on.

## Najważniejsza wartość projektu
KRK Alert nie jest wyłącznie formularzem zgłoszeniowym.

To prototyp narzędzia SmartCity, które:

- upraszcza komunikację mieszkańca z miastem,
- standaryzuje zgłoszenia,
- porządkuje dane miejskie,
- może wspierać szybszą reakcję służb i jednostek miejskich,
- pomaga identyfikować powtarzające się problemy w przestrzeni miasta.
