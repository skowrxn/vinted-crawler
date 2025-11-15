# Vinted Viral Tracker

Profesjonalna aplikacja webowa do śledzenia najpopularniejszych (viralowych) produktów z Vinted.

## Funkcjonalności

- ✅ **Input dla cookies** - wklej pliki cookies w formacie JSON
- ✅ **Konfigurowalne wyszukiwanie** - możliwość edycji URL i parametrów wyszukiwania
- ✅ **Estetyczna animacja ładowania** - ładna animacja podczas pobierania produktów
- ✅ **Grid 4-kolumnowy** - responsywny układ produktów (1/2/3/4 kolumny w zależności od ekranu)
- ✅ **Wyświetlanie produktów** - zdjęcia, tytuł, liczba like (czerwony badge)
- ✅ **Hover animations** - płynne animacje po najechaniu
- ✅ **Otwieranie w nowej karcie** - kliknięcie produktu otwiera go w Vinted
- ✅ **Sortowanie** - produkty sortowane od największej liczby like
- ✅ **Supabase integration** - zapis wyników do PostgreSQL na DigitalOcean
- ✅ **Historia wyszukiwań** - podgląd i ładowanie historycznych wyników
- ✅ **Dark mode** - pełne wsparcie trybu ciemnego
- ✅ **Design system** - zgodność ze style_guide.json

## Tech Stack

- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS 3.4** - Styling
- **PostgreSQL** - Database (Supabase on DigitalOcean)
- **Axios** - HTTP client

## Instalacja

1. Zainstaluj zależności:
```bash
npm install
```

2. Skopiuj plik `.env.example` do `.env` i skonfiguruj połączenie z bazą danych:
```bash
cp .env.example .env
```

3. Edytuj plik `.env`:
```env
DB_HOST=your_digitalocean_ip
DB_PORT=5432
DB_NAME=vinted_viral
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
```

4. Uruchom aplikację w trybie deweloperskim:
```bash
npm run dev
```

5. Otwórz w przeglądarce: [http://localhost:3000](http://localhost:3000)

## Użytkowanie

### 1. Przygotuj cookies

Wyeksportuj pliki cookies z przeglądarki w formacie JSON, np.:
```json
[
  {"name": "cookie_name", "value": "cookie_value"},
  {"name": "another_cookie", "value": "another_value"}
]
```

### 2. Wklej cookies

Wklej JSON z cookies do textarea. Aplikacja automatycznie waliduje format.

### 3. Skonfiguruj wyszukiwanie (opcjonalnie)

Domyślne wartości:
- **URL**: `https://www.vinted.pl/api/v2/catalog/items`
- **Parametry**: `per_page=200&search_text=&catalog_ids=&order=newest_first&size_ids=&brand_ids=15971&status_ids[]=1&status_ids[]=6&color_ids=&material_ids=`

Możesz je edytować jednorazowo.

### 4. Znajdź produkty

Kliknij "Znajdź produkty" - aplikacja:
- Pobierze produkty z 3 stron Vinted (do 600 produktów)
- Posortuje je według liczby polubień
- Wyświetli top 30 w pięknym gridzie
- Zapisze wyniki do bazy danych

### 5. Przeglądaj historię

Kliknij "Historia wyszukiwań" aby:
- Zobaczyć poprzednie wyszukiwania
- Załadować historyczne wyniki

## Struktura projektu

```
vinted-crawler/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── fetch-products/
│   │   │   │   └── route.js        # API do pobierania produktów
│   │   │   └── history/
│   │   │       └── route.js        # API historii
│   │   ├── globals.css             # Globalne style + animacje
│   │   ├── layout.js               # Root layout
│   │   └── page.js                 # Główna strona
│   ├── components/
│   │   ├── Header.js               # Header z toggle theme
│   │   ├── ProductCard.js          # Karta produktu
│   │   ├── LoadingSpinner.js       # Animacja ładowania
│   │   └── HistoryModal.js         # Modal historii
│   └── lib/
│       └── db.js                   # Funkcje bazodanowe
├── .env                            # Konfiguracja (NIE commituj!)
├── .env.example                    # Przykładowa konfiguracja
├── next.config.js                  # Konfiguracja Next.js
├── tailwind.config.js              # Konfiguracja Tailwind
└── package.json                    # Zależności

```

## Baza danych

Aplikacja automatycznie tworzy tabelę przy pierwszym uruchomieniu:

```sql
CREATE TABLE search_results (
    id SERIAL PRIMARY KEY,
    search_url TEXT NOT NULL,
    search_params TEXT NOT NULL,
    items_data JSONB NOT NULL,
    items_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Style Guide

Aplikacja jest w 100% zgodna z `style_guide.json`:
- Kolory: gray-900/100 dla tekstu, orange-600/400 dla akcentów
- Tła: #fafafa (light), #0f0f0f (dark)
- Fonty: font-semibold dla headings, font-medium dla labels
- Spacing: standardowy system 4/6/8
- Radius: rounded-xl dla kart
- Animacje: smooth transitions 300ms

## Production Build

```bash
npm run build
npm start
```

## License

MIT
