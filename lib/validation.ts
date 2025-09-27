import { z } from "zod";

export const serverSchema = z.object({
  name: z
    .string()
    .min(1, "Server name is required")
    .max(50, "Server name too long"),
  ip: z.string().ip("Invalid IP address"),
  country: z.string().min(1, "Country is required"),
  country_code: z.string().min(2, "Country code is required").max(2),
  city: z.string().min(1, "City is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  os_type: z.enum(["android", "ios", "both"]),
  is_pro: z.boolean(),
  mode: z.enum(["test", "live"]),
  categories: z.array(z.string()),
  openvpn_username: z.string().optional(),
  openvpn_password: z.string().optional(),
  openvpn_config: z.string().optional(),
  wireguard_address: z.string().optional(),
  wireguard_config: z.string().optional(),
});

export const adSchema = z.object({
  type: z.string().min(1, "Type is required"),
  position: z.string().min(1, "Position is required"),
  os_type: z.enum(["android", "ios", "both"]),
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
