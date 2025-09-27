import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CountryLite = { name: string; isoCode: string };
type CityLite = {
  name: string;
  latitude: string; // CSC returns strings
  longitude: string;
  countryCode: string;
  stateCode?: string;
};

export function useWorldLocations() {
  // Countries data
  const [countries, setCountries] = useState<CountryLite[]>([]);
  const [loaded, setLoaded] = useState(false); // reflects module + countries loaded

  // Keep CSC classes & city cache in stable refs (avoid re-renders)
  const refsRef = useRef<{ Country?: any; City?: any }>({});
  const citiesCacheRef = useRef<Record<string, CityLite[]>>({});

  // Lazy-load library once; keep classes in refs, data in state
  useEffect(() => {
    let mounted = true;
    (async () => {
      const mod = await import("country-state-city");
      if (!mounted) return;

      const Country = (mod as any).Country;
      const City = (mod as any).City;

      refsRef.current.Country = Country;
      refsRef.current.City = City;

      const all = (Country.getAllCountries?.() ?? []) as CountryLite[];
      // Sort for consistent UX
      all.sort((a, b) => a.name.localeCompare(b.name));
      setCountries(all);
      setLoaded(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Stable city loader with in-memory cache per country ISO2
  const getCitiesOfCountry = useCallback(
    async (iso2: string): Promise<CityLite[]> => {
      if (!iso2) return [];
      const cached = citiesCacheRef.current[iso2];
      if (cached) return cached;

      const City = refsRef.current.City;
      if (!City) return []; // module not ready yet

      const list = (City.getCitiesOfCountry?.(iso2) ?? []) as CityLite[];
      list.sort((a, b) => a.name.localeCompare(b.name));
      citiesCacheRef.current[iso2] = list;
      return list;
    },
    []
  );

  // Fast lookup for country name by ISO2
  const countryNameByCode = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of countries) map[c.isoCode] = c.name;
    return map;
  }, [countries]);

  // Public ready flag: only true when countries have actually populated
  const ready = loaded && countries.length > 0;

  return {
    countries, // [{ name, isoCode }]
    getCitiesOfCountry, // (iso2) => Promise<CityLite[]>
    countryNameByCode, // { [iso2]: name }
    ready, // boolean
  };
}
