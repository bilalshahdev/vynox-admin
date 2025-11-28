"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ServerFormValues } from "@/lib/validation";
import { Control, Controller, useController, useWatch } from "react-hook-form";
import Selectable from "../fields/Selectable";
import TextInput from "../fields/TextInput";

import SearchSelect, { SearchSelectOption } from "@/components/SearchSelect";
import { useSearchCities } from "@/hooks/useCity";
import { useSearchCountries } from "@/hooks/useCountry";
import type { City, Country } from "@/types/api.types";
import { useMemo, useState } from "react";

export default function GeneralSection({
  control,
  country,
  city,
}: {
  control: Control<ServerFormValues>;
  country?: string;
  city?: string;
}) {
  const values = useWatch({ control });
  const { categories = [] } = values.general || {};

  const { field: countryIdField } = useController({
    control,
    name: "general.country_id",
  });

  const { field: cityIdField } = useController({
    control,
    name: "general.city_id",
  });

  // search states
  const [countryQuery, setCountryQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");

  // fetch countries + cities
  const { data: countryRes } = useSearchCountries(countryQuery, 20);
  const countries: Country[] = countryRes?.data ?? [];

  const { data: cityRes } = useSearchCities(
    cityQuery,
    20,
    !!countryIdField.value
  );
  const allCities: City[] = useMemo(() => cityRes?.data ?? [], [cityRes?.data]);

  const cities = useMemo(
    () =>
      countryIdField.value
        ? allCities.filter(
            (c) =>
              (typeof c.country === "string" ? c.country : c.country?._id) ===
              countryIdField.value
          )
        : [],
    [allCities, countryIdField.value]
  );

  // map to SearchSelectOptions
  const countryOptions: SearchSelectOption[] = countries.map((c) => ({
    value: c._id,
    label: `${c.name} (${c.country_code})`,
  }));

  const cityOptions: SearchSelectOption[] = cities.map((ct) => ({
    value: ct._id,
    label: ct.state ? `${ct.name} (${ct.state})` : ct.name,
  }));


  const handleCountrySelect = (id: string | null) => {
    countryIdField.onChange(id ?? "");
    cityIdField.onChange("");
  };

  const handleCitySelect = (id: string | null) => {
    cityIdField.onChange(id ?? "");
  };

  const toggleCategory = (
    cat: "gaming" | "streaming",
    checked: boolean,
    current: string[]
  ) => {
    const set = new Set(current);
    checked ? set.add(cat) : set.delete(cat);
    return Array.from(set);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Configure server basic settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name + IP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            control={control}
            name="general.name"
            label="Server Name"
            placeholder="e.g., US-East-1"
          />
          <TextInput
            control={control}
            name="general.ip"
            label="IP Address"
            placeholder="203.0.113.45"
          />
        </div>

        {/* Country + City Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchSelect
            control={control}
            name="general.country_id"
            label="Country"
            options={countryOptions}
            placeholder="Search country..."
            onSearchInput={setCountryQuery}
            debounceMs={300}
            onValueSelect={handleCountrySelect}
            selectedLabel={country}
          />

          <SearchSelect
            control={control}
            name="general.city_id"
            label="City"
            options={cityOptions}
            placeholder={
              countryIdField.value ? "Search city..." : "Select country first"
            }
            onSearchInput={setCityQuery}
            debounceMs={300}
            onValueSelect={handleCitySelect}
            selectedLabel={city}
            disabled={!countryIdField.value}
          />
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <Label>Categories</Label>
          <div className="flex gap-6">
            <Controller
              control={control}
              name="general.categories"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gaming"
                    checked={categories.includes("gaming")}
                    onCheckedChange={(c) =>
                      field.onChange(
                        toggleCategory("gaming", Boolean(c), field.value || [])
                      )
                    }
                  />
                  <Label htmlFor="gaming">Gaming</Label>
                </div>
              )}
            />
            <Controller
              control={control}
              name="general.categories"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="streaming"
                    checked={categories.includes("streaming")}
                    onCheckedChange={(c) =>
                      field.onChange(
                        toggleCategory(
                          "streaming",
                          Boolean(c),
                          field.value || []
                        )
                      )
                    }
                  />
                  <Label htmlFor="streaming">Streaming</Label>
                </div>
              )}
            />
          </div>
        </div>

        {/* OS, Mode, Pro Switch */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Controller
            control={control}
            name="general.os_type"
            render={({ field }) => (
              <Selectable
                label="OS Type"
                placeholder="Select OS type"
                options={[
                  { value: "android", label: "Android" },
                  { value: "ios", label: "iOS" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="general.mode"
            render={({ field }) => (
              <Selectable
                label="Mode"
                placeholder="Select mode"
                options={[
                  { value: "test", label: "Test" },
                  { value: "live", label: "Live" },
                  { value: "off", label: "Off" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div className="flex items-center space-x-2 pt-6">
            <Controller
              control={control}
              name="general.is_pro"
              render={({ field }) => (
                <>
                  <Switch
                    id="is_pro"
                    checked={field.value}
                    onCheckedChange={(c) => field.onChange(Boolean(c))}
                  />
                  <Label htmlFor="is_pro">Pro Server</Label>
                </>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
