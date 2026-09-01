import { getCitiesForState, INDIA_STATE_NAMES } from './india-location-data';

export interface CountryStateCityCountry {
  name: string;
  iso2: string;
}

export interface CountryStateCityState {
  name: string;
  iso2: string;
}

export interface CountryStateCityCity {
  name: string;
}

function sortByName<T extends { name: string }>(items: T[]) {
  return [...items].sort((left, right) => left.name.localeCompare(right.name, 'en', { sensitivity: 'base' }));
}

function uniqueByName<T extends { name: string }>(items: T[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = item.name.trim().toLocaleLowerCase('en');
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

const EXCLUDED_INDIA_STATE_NAMES = new Set(['Andaman and Nicobar Islands']);
const CSC_API_BASE_URL = 'https://api.countrystatecity.in/v1';
const CSC_API_KEY = process.env.EXPO_PUBLIC_CSC_API_KEY;

const countriesCache = new Map<string, CountryStateCityCountry[]>();
const statesCache = new Map<string, CountryStateCityState[]>();
const citiesCache = new Map<string, CountryStateCityCity[]>();

async function fetchCscApi<T>(path: string): Promise<T> {
  if (!CSC_API_KEY) {
    throw new Error('Country/state/city API key is missing.');
  }

  const response = await fetch(`${CSC_API_BASE_URL}${path}`, {
    headers: {
      'X-CSCAPI-KEY': CSC_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Country/state/city request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

type CscCountryResponse = {
  name: string;
  iso2: string;
};

type CscStateResponse = {
  name: string;
  iso2: string;
};

type CscCityResponse = {
  name: string;
};

export const countryStateCityService = {
  async getCountries(): Promise<CountryStateCityCountry[]> {
    const cacheKey = 'all';
    const cached = countriesCache.get(cacheKey);
    if (cached) return cached;

    const countries = await fetchCscApi<CscCountryResponse[]>('/countries');
    const options = sortByName(uniqueByName(countries.map((country) => ({
      name: country.name,
      iso2: country.iso2,
    }))));
    countriesCache.set(cacheKey, options);
    return options;
  },

  async getStates(countryCode: string): Promise<CountryStateCityState[]> {
    if (countryCode === 'IN') {
      return sortByName(
        INDIA_STATE_NAMES
          .filter((name) => !EXCLUDED_INDIA_STATE_NAMES.has(name))
          .map((name) => ({ name, iso2: name })),
      );
    }

    const cached = statesCache.get(countryCode);
    if (cached) return cached;

    const states = await fetchCscApi<CscStateResponse[]>(`/countries/${countryCode}/states`);
    const options = sortByName(states.map((state) => ({ name: state.name, iso2: state.iso2 })));
    statesCache.set(countryCode, options);
    return options;
  },

  async getCities(countryCode: string, stateCode: string): Promise<CountryStateCityCity[]> {
    if (countryCode === 'IN') {
      if (!stateCode) return [];
      return sortByName(uniqueByName(getCitiesForState(stateCode).map((name) => ({ name }))));
    }

    if (!stateCode) return [];

    const cacheKey = `${countryCode}:${stateCode}`;
    const cached = citiesCache.get(cacheKey);
    if (cached) return cached;

    const cities = await fetchCscApi<CscCityResponse[]>(`/countries/${countryCode}/states/${stateCode}/cities`);
    const options = sortByName(uniqueByName(cities.map((city) => ({ name: city.name }))));
    citiesCache.set(cacheKey, options);
    return options;
  },
};
