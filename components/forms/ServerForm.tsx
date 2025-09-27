// components/forms/ServerForm.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddServer,
  useGetServer,
  useUpdateServer,
} from "@/hooks/useServers";
import { useWorldLocations } from "@/hooks/useWorldLocations";
import { serverSchema } from "@/lib/validation";
import { OSType } from "@/types/api.types";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Selectable from "./fields/Selectable";
import { useGetDropdownByName } from "@/hooks/useDropdowns";

type FormState = {
  /** General */
  name: string;
  categories: Array<"gaming" | "streaming">;
  country: string;
  country_code: string;
  city: string;
  ip: string;
  latitude: number;
  longitude: number;
  os_type: OSType;
  is_pro: boolean;
  mode: "test" | "live";
  /** OpenVPN (flat for UI; mapped on submit) */
  openvpn_username?: string;
  openvpn_password?: string;
  openvpn_config?: string;
  /** WireGuard (flat for UI; mapped on submit) */
  wireguard_address?: string;
  wireguard_config?: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  categories: [],
  country: "",
  country_code: "",
  city: "",
  ip: "",
  latitude: 0,
  longitude: 0,
  os_type: "android",
  is_pro: false,
  mode: "test",
  openvpn_username: "",
  openvpn_password: "",
  openvpn_config: "",
  wireguard_address: "",
  wireguard_config: "",
};

export function ServerForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const { data: serverResp } = useGetServer(id ?? "", { enabled: isEdit });
  const server = serverResp?.data;

  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { countries, getCitiesOfCountry, countryNameByCode, ready } =
    useWorldLocations();

    // const {} = useGetDropdownByName("")

  const countryOptions = useMemo(
    () => countries.map((c) => ({ value: c.isoCode, label: c.name })),
    [countries]
  );

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");

  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [cityByKey, setCityByKey] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!server) return;
    const iso2 = server.country_code || "";

    setFormData({
      name: server.name,
      categories: server.categories ?? [],
      country: server.country,
      country_code: server.country_code,
      city: server.city,
      ip: server.ip,
      latitude: Number(server.latitude) || 0,
      longitude: Number(server.longitude) || 0,
      os_type: server.os_type,
      is_pro: server.is_pro,
      mode: server.mode,
      openvpn_username: server.openvpn_config?.username ?? "",
      openvpn_password: server.openvpn_config?.password ?? "",
      openvpn_config: server.openvpn_config?.config ?? "",
      wireguard_address: server.wireguard_config?.address ?? "",
      wireguard_config: server.wireguard_config?.config ?? "",
    });
    setSelectedCountryCode(iso2);
  }, [server, countryNameByCode]);

  useEffect(() => {
    if (!selectedCountryCode) {
      setCityOptions([]);
      setCityByKey({});
      return;
    }
    let mounted = true;
    (async () => {
      const cities = await getCitiesOfCountry(selectedCountryCode);
      if (!mounted) return;

      const map: Record<string, any> = {};
      const opts = cities.map((c) => {
        const key = `${c.name}__${c.stateCode ?? ""}__${c.countryCode}`;
        map[key] = c;

        const label = c.stateCode ? `${c.name} (${c.stateCode})` : c.name;
        return { value: key, label };
      });

      setCityByKey(map);
      setCityOptions(opts);

      if (server?.city && !formData.latitude && !formData.longitude) {
        const found = opts.find(
          (o) =>
            o.label.startsWith(server.city + " ") || o.label === server.city
        );
        if (found) {
          const city = map[found.value];
          setFormData((p) => ({
            ...p,
            city: city.name,
            latitude: parseFloat(city.latitude) || 0,
            longitude: parseFloat(city.longitude) || 0,
          }));
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedCountryCode, getCitiesOfCountry]);

  const selectedCityValue = useMemo(() => {
    if (!formData.city) return undefined; // keep placeholder
    const entry = Object.entries(cityByKey).find(
      ([, c]) => c.name === formData.city
    );
    return entry?.[0]; // the key we constructed for the option.value
  }, [formData.city, cityByKey]);

  const { mutateAsync: addServer, isPending: adding } = useAddServer();
  const { mutateAsync: editServer, isPending: updating } = useUpdateServer();

  const handleCategoryChange = (
    category: "gaming" | "streaming",
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      categories: checked
        ? Array.from(new Set([...(prev.categories ?? []), category]))
        : (prev.categories ?? []).filter((c) => c !== category),
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = serverSchema.parse({
        ...formData,

        country_code: selectedCountryCode,
        country:
          formData.country ||
          (selectedCountryCode ? countryNameByCode[selectedCountryCode] : ""),
      });

      setErrors({});

      const payload: any = {
        general: {
          name: validated.name,
          categories: validated.categories,
          country: validated.country,
          city: validated.city,
          country_code: validated.country_code,
          is_pro: validated.is_pro,
          mode: validated.mode,
          ip: validated.ip,
          latitude: validated.latitude,
          longitude: validated.longitude,
          os_type: validated.os_type,
        },
      };

      if (validated.openvpn_username) {
        payload.openvpn_config = {
          username: validated.openvpn_username,
          password: validated.openvpn_password || "",
          config: validated.openvpn_config || "",
        };
      }

      if (validated.wireguard_address) {
        payload.wireguard_config = {
          address: validated.wireguard_address,
          config: validated.wireguard_config || "",
        };
      }

      if (isEdit && id) {
        await editServer({ id, data: payload });
        startTransition(() => router.replace("/servers"));
      } else {
        await addServer(payload);
        setFormData(EMPTY_FORM);
        setSelectedCountryCode("");
        startTransition(() => router.replace("/servers"));
      }
      router.refresh();
    } catch (err: any) {
      if (err?.errors) {
        const next: Record<string, string> = {};
        err.errors.forEach((z: any) => {
          const key = Array.isArray(z.path) ? z.path[0] : String(z.path);
          next[key] = z.message;
        });
        setErrors(next);
        return;
      }
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="w-full">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="openvpn">OpenVPN</TabsTrigger>
            <TabsTrigger value="wireguard">WireGuard</TabsTrigger>
          </TabsList>

          {/* GENERAL */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Configure server basic settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Server Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="e.g., US-East-1"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ip">IP Address</Label>
                    <Input
                      id="ip"
                      value={formData.ip}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, ip: e.target.value }))
                      }
                      placeholder="203.0.113.45"
                      className={errors.ip ? "border-red-500" : ""}
                    />
                    {errors.ip && (
                      <p className="text-sm text-red-500">{errors.ip}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Country (ISO2) */}
                  <Selectable
                    label="Country"
                    placeholder={
                      ready ? "Select country" : "Loading countries..."
                    }
                    options={countryOptions}
                    value={selectedCountryCode}
                    disabled={!ready}
                    onChange={(iso2: string) => {
                      const name = iso2 ? countryNameByCode[iso2] : "";
                      setSelectedCountryCode(iso2);
                      setCityOptions([]);
                      setCityByKey({});
                      setFormData((p) => ({
                        ...p,
                        country_code: iso2,
                        country: name,
                        city: "",
                        latitude: 0,
                        longitude: 0,
                      }));
                    }}
                    errors={errors}
                  />

                  <Selectable
                    label="City"
                    placeholder={
                      selectedCountryCode
                        ? cityOptions.length
                          ? "Select city"
                          : "Loading cities..."
                        : "Select country first"
                    }
                    options={cityOptions}
                    value={selectedCityValue} // <-- undefined when none selected
                    onChange={(key: string) => {
                      const city = cityByKey[key];
                      if (!city) {
                        setFormData((p) => ({
                          ...p,
                          city: "",
                          latitude: 0,
                          longitude: 0,
                        }));
                        return;
                      }
                      setFormData((p) => ({
                        ...p,
                        city: city.name,
                        latitude: parseFloat(city.latitude) || 0,
                        longitude: parseFloat(city.longitude) || 0,
                      }));
                    }}
                    disabled={!formData.country_code}
                    errors={errors}
                  />
                </div>

                {/* Latitude / Longitude reflect selection but remain editable */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          latitude: Number.parseFloat(e.target.value),
                        }))
                      }
                      disabled={!formData.city}
                      placeholder="50.1109"
                      className={errors.latitude ? "border-red-500" : ""}
                    />
                    {errors.latitude && (
                      <p className="text-sm text-red-500">{errors.latitude}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          longitude: Number.parseFloat(e.target.value),
                        }))
                      }
                      disabled={!formData.city}
                      placeholder="8.6821"
                      className={errors.longitude ? "border-red-500" : ""}
                    />
                    {errors.longitude && (
                      <p className="text-sm text-red-500">{errors.longitude}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Categories</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gaming"
                        checked={formData.categories.includes("gaming")}
                        onCheckedChange={(checked) =>
                          handleCategoryChange("gaming", Boolean(checked))
                        }
                      />
                      <Label htmlFor="gaming">Gaming</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="streaming"
                        checked={formData.categories.includes("streaming")}
                        onCheckedChange={(checked) =>
                          handleCategoryChange("streaming", Boolean(checked))
                        }
                      />
                      <Label htmlFor="streaming">Streaming</Label>
                    </div>
                  </div>
                  {errors.categories && (
                    <p className="text-sm text-red-500">{errors.categories}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Selectable
                    label="OS Type"
                    placeholder="Select OS type"
                    options={[
                      { value: "android", label: "Android" },
                      { value: "ios", label: "iOS" },
                      { value: "both", label: "Both" },
                    ]}
                    value={formData.os_type}
                    onChange={(value: string) =>
                      setFormData((p) => ({ ...p, os_type: value as any }))
                    }
                    errors={errors}
                  />
                  <Selectable
                    label="Mode"
                    placeholder="Select mode"
                    options={[
                      { value: "test", label: "Test" },
                      { value: "live", label: "Live" },
                    ]}
                    value={formData.mode}
                    onChange={(value: string) =>
                      setFormData((p) => ({ ...p, mode: value as any }))
                    }
                    errors={errors}
                  />
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="is_pro"
                      checked={formData.is_pro}
                      onCheckedChange={(checked) =>
                        setFormData((p) => ({ ...p, is_pro: Boolean(checked) }))
                      }
                    />
                    <Label htmlFor="is_pro">Pro Server</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OPENVPN */}
          <TabsContent value="openvpn" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>OpenVPN Configuration</CardTitle>
                <CardDescription>
                  Configure OpenVPN settings for this server
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openvpn_username">Username</Label>
                    <Input
                      id="openvpn_username"
                      value={formData.openvpn_username}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          openvpn_username: e.target.value,
                        }))
                      }
                      placeholder="vpn_user"
                      className={
                        errors.openvpn_username ? "border-red-500" : ""
                      }
                    />
                    {errors.openvpn_username && (
                      <p className="text-sm text-red-500">
                        {errors.openvpn_username}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openvpn_password">Password</Label>
                    <Input
                      id="openvpn_password"
                      type="password"
                      value={formData.openvpn_password}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          openvpn_password: e.target.value,
                        }))
                      }
                      placeholder="••••••••"
                      className={
                        errors.openvpn_password ? "border-red-500" : ""
                      }
                    />
                    {errors.openvpn_password && (
                      <p className="text-sm text-red-500">
                        {errors.openvpn_password}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openvpn_config">Configuration</Label>
                  <Textarea
                    id="openvpn_config"
                    value={formData.openvpn_config}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        openvpn_config: e.target.value,
                      }))
                    }
                    placeholder="OpenVPN configuration content..."
                    rows={8}
                    className={errors.openvpn_config ? "border-red-500" : ""}
                  />
                  {errors.openvpn_config && (
                    <p className="text-sm text-red-500">
                      {errors.openvpn_config}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WIREGUARD */}
          <TabsContent value="wireguard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>WireGuard Configuration</CardTitle>
                <CardDescription>
                  Configure WireGuard settings for this server
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wireguard_address">Address</Label>
                  <Input
                    id="wireguard_address"
                    value={formData.wireguard_address}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        wireguard_address: e.target.value,
                      }))
                    }
                    placeholder="10.0.0.1/24"
                    className={errors.wireguard_address ? "border-red-500" : ""}
                  />
                  {errors.wireguard_address && (
                    <p className="text-sm text-red-500">
                      {errors.wireguard_address}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wireguard_config">Configuration</Label>
                  <Textarea
                    id="wireguard_config"
                    value={formData.wireguard_config}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        wireguard_config: e.target.value,
                      }))
                    }
                    placeholder="WireGuard configuration content..."
                    rows={8}
                    className={errors.wireguard_config ? "border-red-500" : ""}
                  />
                  {errors.wireguard_config && (
                    <p className="text-sm text-red-500">
                      {errors.wireguard_config}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="submit" variant="default" disabled={adding || updating}>
            {isEdit ? "Update Server" : "Create Server"}
          </Button>
        </div>
      </form>
    </div>
  );
}
