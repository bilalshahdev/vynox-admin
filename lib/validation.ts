// lib/validation.ts

import { z } from "zod";

export const serverSchema = z.object({
  general: z.object({
    name: z.string(),
    ip: z.string(),
    country_id: z.string().optional(), 
    city_id: z.string().optional(),
    categories: z.array(z.string()),
    os_type: z.string(),
    is_pro: z.boolean(),
    mode: z.string(),
  }),
  openvpn_config: z
    .object({
      username: z.string().optional(),
      password: z.string().optional(),
      config: z.string().optional(),
    })
    .optional(),
  wireguard_config: z
    .object({
      address: z.string().optional(),
      config: z.string().optional(),
    })
    .optional(),
});

export type ServerFormValues = z.infer<typeof serverSchema>;

export const adSchema = z.object({
  type: z.string().min(1, "Type is required"),
  position: z.string().min(1, "Position is required"),
  os_type: z.enum(["android", "ios"]),
  status: z.boolean(),
  ad_id: z.string().min(1, "Ad unit ID is required"),
});

export const pageSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug too long"),
  content: z.string().min(1, "Content is required"),
  is_active: z.boolean(),
  meta_description: z.string().max(160, "Meta description too long").optional(),
});

export const dropdownSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  type: z.string().min(1, "Type is required"),
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
  is_active: z.boolean(),
  sort_order: z.number().min(0),
});

export const faqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters long"),
  answer: z.string().min(10, "Answer must be at least 10 characters long"),
});

// ----------------- COUNTRY -----------------

export const countrySchema = z
  .object({
    name: z.string().min(2, "Country name is required"),

    slug: z
      .string()
      .min(2, "Slug is required")
      .regex(/^[a-z0-9-]+$/, "Slug must be lowercase and URL-friendly"),

    country_code: z
      .string()
      .min(2, "Country code is required")
      .max(5, "Country code too long")
      .regex(/^[A-Z]{2,5}$/, "Country code must be uppercase letters"),

    flag: z
      .string()
      .regex(/^[a-z]{2,5}\.png$/, "Flag must be in format 'xx.png'")
      .optional(),
  })
  .refine(
    (data) =>
      !data.flag || data.flag === `${data.country_code.toLowerCase()}.png`,
    {
      message: "Flag must be {country_code}.png",
      path: ["flag"],
    }
  );

export type CountryFormValues = z.infer<typeof countrySchema>;

// ----------------- CITY -----------------
export const citySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  state: z.string().min(1),
  country: z.string().length(2, "Must be ISO2 code"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type CityFormValues = z.infer<typeof citySchema>;
