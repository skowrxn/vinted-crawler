# Vinted Scraper

Aplikacja webowa + web scraper do śledzenia najpopularniejszych produktów z Vinted.

## Tech Stack

-   **Next.js + React**
-   **Tailwind CSS**
-   **Supabase**
-   **Axios**

## Instalacja

1. Zainstaluj zależności:

```bash
npm install
```

2. Skonfiguruj bazę danych w pliku `.env`:

```env
DB_HOST=your_digitalocean_ip
DB_PORT=5432
DB_NAME=vinted_viral
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
```

3. Uruchom aplikację:

```bash
npm run dev
```

4. Otwórz [http://localhost:3000](http://localhost:3000)

## Użytkowanie

### 1. Przygotuj cookies

Wyeksportuj cookies z przeglądarki jako JSON (np przy użyciu wtyczki do Google Chrome):

```json
[{ "name": "cookie_name", "value": "cookie_value" }]
```

### 2. Wklej cookies i znajdź produkty

Aplikacja:

-   Pobierze produkty z 3 stron Vinted (100 produktów)
-   Posortuje według liczby polubień
-   Wyświetli w responsywnym layoucie 4 kolumnowym
-   Zapisze wyniki do bazy danych

### 3. Przeglądaj historię

Kliknij "Historia" aby załadować poprzednie wyniki.
