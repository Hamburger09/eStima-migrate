// This function is used to create a lookup getter function that retrieves a value from a source array based on a matching field and key. It returns a function that takes a row object and returns the corresponding value from the source array or 'N/A' if not found.
// For example, it can be used to get the country name from a list of countries based on the country ID in the row object.

import { formatDistanceToNow, Locale } from "date-fns";
import { ru, enUS, uz  } from "date-fns/locale";

import {LanguageService} from "../services/language.service"
import { inject } from "@angular/core";

export function createLookupGetter(
  sourceFn: () => any[],
  matchField: string,
  key: string,
  returnField: string
): (row: any) => string {
  return (row: any) => {
    const source = sourceFn();
    const item = source?.find(
      el => String(el[matchField]) === String(row[key])
    );
    return item ? item[returnField] : 'N/A';
  };
}

// This function returns last activity time in a human-readable format, such as "5 minutes ago" or "2 hours ago". It uses the `formatDistanceToNow` function from the `date-fns` library to format the date.
export function formatLastActivity(date: Date): string {
  const localeMap: Record<string, Locale> ={
    'en': enUS,
    'ru': ru,
    'uz': uz,
  }
  let currentLang = localStorage.getItem('lang') || 'en';

  const locale = localeMap[currentLang] || enUS;
  return formatDistanceToNow(date, { addSuffix: true, locale: locale });
}

export function getCitiesByCountry(
  countryId: any,
  cities: any[],
  cityService: { filterCitiesByCountry: Function }
) {
  if (!countryId) return [];
  return cityService.filterCitiesByCountry(countryId, cities);
}