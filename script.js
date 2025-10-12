const axios = require("axios");
const fs = require("fs");
const path = require("path");

/**
 * Funkcja do formatowania ciasteczek z formatu JSON na string akceptowany w nagłówku HTTP.
 * @param {Array<Object>} cookies - Tablica obiektów z ciasteczkami.
 * @returns {string} Sformatowany string z ciasteczkami.
 */
function formatCookies(cookies) {
    if (!Array.isArray(cookies)) {
        throw new Error(
            "Dane wejściowe muszą być tablicą ciasteczek w formacie JSON."
        );
    }
    return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

/**
 * Główna funkcja do pobierania i przetwarzania danych z Vinted.
 */
async function findViralItems() {
    let cookies;
    let cookieHeader;

    try {
        const cookiesJsonString = fs.readFileSync("cookies.json", "utf-8");
        cookies = JSON.parse(cookiesJsonString);
        cookieHeader = formatCookies(cookies);
    } catch (error) {
        if (error.code === "ENOENT") {
            console.error(
                "Błąd: Plik cookies.json nie został znaleziony. Upewnij się, że znajduje się w tym samym folderze co skrypt."
            );
        } else if (error instanceof SyntaxError) {
            console.error(
                "Błąd: Plik cookies.json zawiera nieprawidłowy format JSON."
            );
        } else {
            console.error(
                "Wystąpił błąd podczas wczytywania pliku cookies.json:",
                error.message
            );
        }
        return;
    }

    const outputDir = "results";
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const BASE_URL = "https://www.vinted.pl/api/v2/catalog/items";
    const PARAMS =
        "per_page=200&search_text=&catalog_ids=&order=newest_first&size_ids=&brand_ids=15971&status_ids[]=1&status_ids[]=6&color_ids=&material_ids=";
    const pagesToFetch = [1, 2, 3];
    let allItems = [];

    console.log(
        "Ciasteczka wczytane pomyślnie. Rozpoczynam pobieranie danych z Vinted...\n"
    );

    try {
        const requests = pagesToFetch.map((page) =>
            axios.get(`${BASE_URL}?page=${page}&${PARAMS}`, {
                headers: {
                    Cookie: cookieHeader,
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
            })
        );

        const responses = await Promise.all(requests);

        responses.forEach((response) => {
            if (response.data && Array.isArray(response.data.items)) {
                allItems = allItems.concat(response.data.items);
            }
        });
        allItems.sort((a, b) => b.favourite_count - a.favourite_count);

        const top30Items = allItems.slice(0, 30);

        let fileContent = "--- 30 NAJPOPULARNIEJSZYCH PRODUKTÓW ---\n\n";

        if (top30Items.length > 0) {
            top30Items.forEach((item, index) => {
                console.log(
                    `${index + 1}. ${item.title} - Polubienia: ${
                        item.favourite_count
                    }\n   URL: ${item.url}\n`
                );
                fileContent += `${index + 1}. ${item.title} - Polubienia: ${
                    item.favourite_count
                }\n`;
                fileContent += `   URL: ${item.url}\n\n`;
            });
        } else {
            fileContent +=
                "Nie znaleziono żadnych produktów. Sprawdź poprawność ciasteczek lub parametry wyszukiwania.";
        }

        const now = new Date();
        const datePart = `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const timePart = `${String(now.getHours()).padStart(2, "0")}-${String(
            now.getMinutes()
        ).padStart(2, "0")}`;
        const filename = `${datePart}_${timePart}.txt`;
        const outputPath = path.join(outputDir, filename);

        fs.writeFileSync(outputPath, fileContent, "utf-8");

        console.log(
            `\nOperacja zakończona sukcesem. Wyniki zostały zapisane w pliku: ${outputPath}`
        );
    } catch (error) {
        console.error(
            "Wystąpił błąd podczas pobierania danych:",
            error.response
                ? `${error.response.status} ${error.response.statusText}`
                : error.message
        );
        console.error("Upewnij się, że Twoje ciasteczka są aktualne.");
    }
}

findViralItems();
