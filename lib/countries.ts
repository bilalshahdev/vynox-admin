// Country and location utilities for VynoxVPN

export interface Country {
  code: string
  name: string
  flag: string
}

export const countries: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
]

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((country) => country.code === code)
}

export function getCountryFlag(code: string): string {
  const country = getCountryByCode(code)
  return country?.flag || "🌍"
}

export function getCountryName(code: string): string {
  const country = getCountryByCode(code)
  return country?.name || code
}

// Common cities for VPN servers
export const popularCities: Record<string, string[]> = {
  US: ["New York", "Los Angeles", "Chicago", "Miami", "Seattle", "Dallas"],
  GB: ["London", "Manchester", "Birmingham"],
  CA: ["Toronto", "Vancouver", "Montreal"],
  DE: ["Berlin", "Frankfurt", "Munich"],
  FR: ["Paris", "Lyon", "Marseille"],
  JP: ["Tokyo", "Osaka", "Kyoto"],
  AU: ["Sydney", "Melbourne", "Brisbane"],
  NL: ["Amsterdam", "Rotterdam", "The Hague"],
  SG: ["Singapore"],
  IN: ["Mumbai", "Delhi", "Bangalore"],
  BR: ["São Paulo", "Rio de Janeiro", "Brasília"],
  SE: ["Stockholm", "Gothenburg", "Malmö"],
  CH: ["Zurich", "Geneva", "Basel"],
  NO: ["Oslo", "Bergen", "Trondheim"],
  IT: ["Rome", "Milan", "Naples"],
  ES: ["Madrid", "Barcelona", "Valencia"],
  KR: ["Seoul", "Busan", "Incheon"],
  HK: ["Hong Kong"],
  TW: ["Taipei", "Kaohsiung", "Taichung"],
  MX: ["Mexico City", "Guadalajara", "Monterrey"],
}

export function getCitiesForCountry(countryCode: string): string[] {
  return popularCities[countryCode] || []
}
