import countriesData from './countries.json';

export interface Country {
  name: string;
  iso2: string;
  dialCode: string;
  flag: string;
}

export const countries: Country[] = countriesData;

export const defaultCountry: Country =
  countries.find(country => country.iso2 === 'US') ?? countries[0];
