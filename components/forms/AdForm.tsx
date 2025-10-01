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
import { useGetDropdownByName } from "@/hooks/useDropdowns";

type AdFormValues = z.infer<typeof adSchema>;

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

  const {
    data: adTypesResp,
    isLoading: isAdTypesLoading,
    isFetching: isAdTypesFetching,
  } = useGetDropdownByName("adTypes");

  const {
    data: adPositionsResp,
    isLoading: isAdPositionsLoading,
    isFetching: isAdPositionsFetching,
  } = useGetDropdownByName("adPositions");

  const ad = adResp?.data;

  const addAd = useAddAd();
  const updateAd = useUpdateAd();

  // Map server dropdown payload → {label, value}
  const adTypeOptions = useMemo(
    () =>
      (adTypesResp?.data?.values ?? []).map(
        (v: { name: string; value: string }) => ({
          label: v.name,
          value: v.value,
        })
      ),
    [adTypesResp]
  );

  const adPositionOptions = useMemo(
    () =>
      (adPositionsResp?.data?.values ?? []).map(
        (v: { name: string; value: string }) => ({
          label: v.name,
          value: v.value,
        })
      ),
    [adPositionsResp]
  );

  const hasAdTypeOptions = adTypeOptions.length > 0;
  const hasAdPositionOptions = adPositionOptions.length > 0;

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
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
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

  useEffect(() => {
    if (!isEdit) {
      const currentType = getValues("type");
      const currentPos = getValues("position");

      if (hasAdTypeOptions) {
        const currentInList = adTypeOptions.some(
          (o) => o.value === currentType
        );
        if (!currentInList)
          setValue("type", adTypeOptions[0].value, { shouldValidate: true });
      }
      if (hasAdPositionOptions) {
        const currentInList = adPositionOptions.some(
          (o) => o.value === currentPos
        );
        if (!currentInList)
          setValue("position", adPositionOptions[0].value, {
            shouldValidate: true,
          });
      }
    }
  }, [
    isEdit,
    adTypeOptions,
    adPositionOptions,
    hasAdTypeOptions,
    hasAdPositionOptions,
    getValues,
    setValue,
  ]);

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

  const loadingDropdowns =
    isAdTypesLoading ||
    isAdTypesFetching ||
    isAdPositionsLoading ||
    isAdPositionsFetching;

  const submitting =
    isSubmitting ||
    addAd.isPending ||
    updateAd.isPending ||
    isAdFetching ||
    loadingDropdowns;

  const EmptyNotice = () => (
    <div
      role="alert"
      className="
      rounded-md border border-dashed p-3 text-sm
      border-amber-300 bg-amber-50 text-amber-900
      dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-100
    "
    >
      <div className="font-medium">No Type options found</div>
      <div className="mt-1">
        No options configured. Please add values in the admin dropdowns.
      </div>
    </div>
  );

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
            {/* Status */}
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

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Platform (static) */}
              <Controller
                name="os_type"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Selectable
                    label="Platform"
                    placeholder="Select platform"
                    options={PLATFORMS as any}
                    value={value}
                    onChange={(v: string) => onChange(v)}
                    errors={{ os_type: errors.os_type?.message ?? "" }}
                    disabled={submitting}
                  />
                )}
              />

              {/* Ad Unit ID */}
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

              {/* Type (from server) */}
              <Controller
                name="type"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Selectable
                    label="Type"
                    placeholder={
                      loadingDropdowns
                        ? "Loading..."
                        : hasAdTypeOptions
                        ? "Select type"
                        : "No options available"
                    }
                    options={adTypeOptions as any}
                    value={value}
                    onChange={(v: string) => onChange(v)}
                    errors={{ type: errors.type?.message ?? "" }}
                    disabled={submitting || !hasAdTypeOptions}
                  />
                )}
              />

              {/* Position (from server) */}
              <Controller
                name="position"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Selectable
                    label="Position"
                    placeholder={
                      loadingDropdowns
                        ? "Loading..."
                        : hasAdPositionOptions
                        ? "Select position"
                        : "No options available"
                    }
                    options={adPositionOptions as any}
                    value={value}
                    onChange={(v: string) => onChange(v)}
                    errors={{ position: errors.position?.message ?? "" }}
                    disabled={submitting || !hasAdPositionOptions}
                  />
                )}
              />
            </div>

            {/* Admin-facing notices when no options are configured */}
            {!loadingDropdowns && !hasAdTypeOptions && <EmptyNotice />}
            {!loadingDropdowns && !hasAdPositionOptions && <EmptyNotice />}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="submit"
            disabled={
              submitting ||
              (!isEdit && (!hasAdTypeOptions || !hasAdPositionOptions))
            }
            variant="default"
          >
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
