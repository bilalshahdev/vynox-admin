// components/cities/CityForm.tsx
"use client";

import { useAddCity, useUpdateCity } from "@/hooks/useCity";
import { useSearchCountries } from "@/hooks/useCountry";
import { citySchema } from "@/lib/validation";
import { City, Country } from "@/types/api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import TextInput from "./fields/TextInput";
import SearchSelect, { SearchSelectOption } from "../SearchSelect";

const CityForm = ({
  city,
  closeDialog,
}: {
  city?: City;
  closeDialog?: () => void;
}) => {
  const methods = useForm<z.infer<typeof citySchema>>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: "",
      slug: "",
      country: "",
      state: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const { handleSubmit, reset, control } = methods;

  const initialCountryLabel = useMemo(() => {
    if (!city) return "";
    if (typeof city.country !== "string" && city.country) {
      const c = city.country;
      // whatever label format you use in options
      return `${c.name} (${c.country_code})`;
    }
    return "";
  }, [city]);

  useEffect(() => {
    if (city) {
      reset({
        name: city.name,
        slug: city.slug,
        country:
          typeof city.country === "string" ? city.country : city.country?._id,
        state: city.state,
        latitude: Number(city.latitude) || 0,
        longitude: Number(city.longitude) || 0,
      });
    }
  }, [city, reset]);

  const [search, setSearch] = useState("");
  const { data: countriesData } = useSearchCountries(search, 20);
  const countries: Country[] = countriesData?.data ?? [];

  const countryOptions: SearchSelectOption[] = countries.map((c) => ({
    value: c._id, // ISO2
    label: `${c.name} (${c.country_code})`,
  }));

  const { mutateAsync: addCityMutation, isPending: addCityLoading } =
    useAddCity();
  const { mutateAsync: updateCityMutation, isPending: updateCityLoading } =
    useUpdateCity();

  const isPending = addCityLoading || updateCityLoading;
  const buttonTitle = isPending ? "Saving..." : "Save";

  const onSubmit = async (data: z.infer<typeof citySchema>) => {
    try {
      if (city) {
        await updateCityMutation({ id: city._id, data });
      } else {
        await addCityMutation(data);
      }
      reset();
      closeDialog?.();
    } catch (error) {
      console.error("City mutation error:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          name="name"
          label="City Name"
          placeholder="Enter city name"
          note="Islamabad"
          control={control}
        />
        <TextInput
          name="slug"
          label="Slug"
          placeholder="Enter slug"
          note="islamabad"
          control={control}
        />

        <SearchSelect
          control={control}
          name="country"
          label="Country"
          options={countryOptions}
          placeholder="Search country..."
          onSearchInput={setSearch}
          selectedLabel={initialCountryLabel} // 👈 important for edit
        />

        <TextInput
          name="state"
          label="State / Province"
          placeholder="Optional state"
          note="Punjab"
          control={control}
        />
        <TextInput
          name="latitude"
          label="Latitude"
          placeholder="Latitude"
          note="33.6844"
          control={control}
          type="number"
        />
        <TextInput
          name="longitude"
          label="Longitude"
          placeholder="Longitude"
          note="73.0479"
          control={control}
          type="number"
        />

        <Button type="submit" disabled={isPending}>
          {buttonTitle}
        </Button>
      </form>
    </FormProvider>
  );
};

export default CityForm;
