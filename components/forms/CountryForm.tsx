"use client";

import { useAddCountry, useUpdateCountry } from "@/hooks/useCountry";
import { countrySchema } from "@/lib/validation";
import { Country } from "@/types/api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import TextInput from "./fields/TextInput";

const CountryForm = ({
  country,
  closeDialog,
}: {
  country?: Country;
  closeDialog?: () => void;
}) => {
  const methods = useForm<z.infer<typeof countrySchema>>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: "",
      slug: "",
      flag: "",
      country_code: "",
    },
  });

  const { handleSubmit, reset, control } = methods;

  useEffect(() => {
    if (country) {
      reset({
        name: country.name,
        slug: country.slug,
        flag: country.flag,
        country_code: country.country_code,
      });
    }
  }, [country, reset]);

  const { mutateAsync: addCountryMutation, isPending: addCountryLoading } =
    useAddCountry();
  const {
    mutateAsync: updateCountryMutation,
    isPending: updateCountryLoading,
  } = useUpdateCountry();

  const isPending = addCountryLoading || updateCountryLoading;
  const buttonTitle = isPending ? "Saving..." : "Save";

  const onSubmit = async (data: z.infer<typeof countrySchema>) => {
    try {
      if (country) {
        await updateCountryMutation({ id: country._id, data });
      } else {
        await addCountryMutation(data);
      }

      reset();
      closeDialog?.();
    } catch (error) {
      console.error("Country mutation error:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          name="name"
          label="Name"
          placeholder="Enter name"
          note="Pakistan"
          control={control}
        />
        <TextInput
          name="slug"
          label="Slug"
          placeholder="Enter slug"
          note="pakistan"
          control={control}
        />
        <TextInput
          name="flag"
          label="Flag"
          placeholder="Enter flag"
          note="pk.png"
          control={control}
        />
        <TextInput
          name="country_code"
          label="Country Code"
          note="PK"
          placeholder="Enter country code"
          control={control}
        />
        <Button type="submit" disabled={isPending}>
          {buttonTitle}
        </Button>
      </form>
    </FormProvider>
  );
};

export default CountryForm;
