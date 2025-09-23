"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Selectable from "./fields/Selectable";

import { useAddAd, useGetAd, useUpdateAd } from "@/hooks/useAds";
import { adSchema } from "@/lib/validation";
import type { z } from "zod";

type AdFormValues = z.infer<typeof adSchema>;

const AD_TYPES = [
  { value: "banner", label: "Banner" },
  { value: "interstitial", label: "Interstitial" },
  { value: "reward", label: "Reward" },
] as const;

const AD_POSITIONS = [
  { value: "home", label: "Home Screen" },
  { value: "splash", label: "Splash Screen" },
  { value: "server", label: "Server List" },
  { value: "report", label: "Report Page" },
] as const;

const PLATFORMS = [
  { value: "android", label: "Android" },
  { value: "ios", label: "iOS" },
] as const;

export function AdForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const {
    data: adResp,
    isLoading: isAdLoading,
    isFetching: isAdFetching,
  } = useGetAd(id ?? "", isEdit);

  const ad = adResp?.data;

  const addAd = useAddAd();
  const updateAd = useUpdateAd();

  const defaultValues = useMemo<AdFormValues>(
    () => ({
      type: "banner",
      position: "home",
      os_type: "android",
      status: true,
      ad_id: "",
    }),
    []
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });
  useEffect(() => {
    if (isEdit && ad && !isAdLoading) {
      reset({
        type: ad.type ?? "banner",
        position: ad.position ?? "home",
        os_type: ad.os_type ?? "android",
        status: ad.status ?? true,
        ad_id: ad.ad_id ?? "",
      });
    }
  }, [isEdit, ad, isAdLoading, reset]);

  const onSubmit = async (values: AdFormValues) => {
    if (isEdit && id) {
      await updateAd.mutateAsync(
        { id, data: values },
        {
          onSuccess: () => {
            startTransition(() => router.replace("/ads"));
          },
        }
      );
    } else {
      await addAd.mutateAsync(values, {
        onSuccess: () => {
          reset(defaultValues);
          startTransition(() => router.replace("/ads"));
        },
      });
    }
  };

  const submitting =
    isSubmitting || addAd.isPending || updateAd.isPending || isAdFetching;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? "Edit Advertisement" : "Create Advertisement"}
            </CardTitle>
            <CardDescription>
              Set up advertisement details and targeting
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 pt-2">
              <Controller
                name="status"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <>
                    <Switch
                      id="is_active"
                      checked={!!value}
                      onCheckedChange={onChange}
                      ref={ref}
                      disabled={submitting}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="os_type"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Selectable
                    label="Platform"
                    placeholder="Select os_type"
                    options={PLATFORMS as any}
                    value={value}
                    onChange={(v: string) => onChange(v)}
                    errors={{ os_type: errors.os_type?.message ?? "" }}
                    disabled={submitting}
                  />
                )}
              />
              <Controller
                name="ad_id"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label htmlFor="ad_id">Advertisement Unit ID</Label>
                    <Input
                      id="ad_id"
                      placeholder="ca-app-pub-123456789/1234567890"
                      disabled={submitting}
                      {...field}
                      className={fieldState.error ? "border-red-500" : ""}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="type"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Selectable
                    label="Type"
                    placeholder="Select type"
                    options={AD_TYPES as any}
                    value={value}
                    onChange={(v: string) => onChange(v)}
                    errors={{ type: errors.type?.message ?? "" }}
                    disabled={submitting}
                  />
                )}
              />

              <Controller
                name="position"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Selectable
                    label="Position"
                    placeholder="Select position"
                    options={AD_POSITIONS as any}
                    value={value}
                    onChange={(v: string) => onChange(v)}
                    errors={{ position: errors.position?.message ?? "" }}
                    disabled={submitting}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={submitting} variant="default">
            {submitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Advertisement"
              : "Create Advertisement"}
          </Button>
        </div>
      </form>
    </div>
  );
}
