// Simple location service that fetches countries and cities from a public API
// Caches results in localStorage to avoid repeated network calls.
const API_URL = "https://countriesnow.space/api/v0.1/countries";

const STORAGE_KEY = "countries_cities_v1";

async function fetchAll() {
  // check cache
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    // ignore
  }

  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    const data = json?.data || [];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // ignore
    }
    return data;
  } catch (err) {
    console.error("Failed to fetch countries & cities", err);
    return [];
  }
}

export const locationService = {
  async getAllCountries() {
    const all = await fetchAll();
    return all.map((c) => c.country).sort();
  },

  async getCitiesForCountry(countryName) {
    const all = await fetchAll();
    const entry = all.find(
      (c) => c.country.toLowerCase() === (countryName || "").toLowerCase()
    );
    return entry ? entry.cities : [];
  },
};

export default locationService;
