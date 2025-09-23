"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useAddPage, useGetPage, useUpdatePage } from "@/hooks/usePages";
import type { Page } from "@/lib/types";

const pageTypes = [
  {
    value: "privacy-policy",
    label: "Privacy Policy",
    description: "Privacy and data protection information",
  },
  {
    value: "terms-of-service",
    label: "Terms of Service",
    description: "Terms and conditions for service usage",
  },
  {
    value: "help-center",
    label: "Help Center",
    description: "FAQ and troubleshooting guides",
  },
  {
    value: "about-us",
    label: "About Us",
    description: "Company information and mission",
  },
  {
    value: "contact",
    label: "Contact",
    description: "Contact information and support",
  },
  {
    value: "changelog",
    label: "Changelog",
    description: "App updates and version history",
  },
  { value: "custom", label: "Custom Page", description: "Custom content page" },
] as const;

const PageFormSchema = z.object({
  type: z
    .string({ required_error: "Please select a page type" })
    .min(1, "Please select a page type"),
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(160, "Title is too long"),
  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(10, "Description must be at least 10 characters"),
});

type PageFormValues = z.infer<typeof PageFormSchema>;

function normalizeType(v: string) {
  return v.trim().toLowerCase();
}

export default function PageForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const { data: fetched, isLoading: isLoadingPage } = useGetPage(id!, isEdit);
  // normalize data shape from hook
  const page: Page = useMemo(() => {
    return fetched?.data as Page;
  }, [fetched]);

  const { mutateAsync: addPage, isPending: isCreating } = useAddPage();
  const { mutateAsync: updatePage, isPending: isUpdating } = useUpdatePage();

  const form = useForm<PageFormValues>({
    resolver: zodResolver(PageFormSchema),
    defaultValues: {
      type: "",
      title: "",
      description: "",
    },
    mode: "onChange",
  });

  // when editing, hydrate defaults after fetch
  useEffect(() => {
    if (isEdit && page) {
      form.reset({
        type: page.type ?? "",
        title: page.title ?? "",
        description: page.description ?? "",
      });
    }
  }, [isEdit, page, form]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = form;

  const onSubmit = async (values: PageFormValues) => {
    const payload = {
      type: normalizeType(values.type),
      title: values.title.trim(),
      description: values.description.trim(),
    };

    if (isEdit && page?._id) {
      await updatePage({ id: page._id, body: payload } as any);
      startTransition(() => router.replace("/pages"));
    } else {
      await addPage(payload as any);
      startTransition(() => router.replace("/pages"));
    }
  };

  const pending =
    isSubmitting || isCreating || isUpdating || (isEdit && isLoadingPage);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          {/* Page Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Page Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <>
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val)}
                      disabled={pending}
                    >
                      <SelectTrigger id="type" className="w-full">
                        <SelectValue placeholder="Select page type" />
                      </SelectTrigger>
                      <SelectContent>
                        {pageTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.type.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <>
                    <Input
                      id="title"
                      placeholder="Enter page title"
                      {...field}
                      disabled={pending}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (HTML or text)</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <>
                  <Textarea
                    id="description"
                    rows={6}
                    placeholder="HTML or text that will be rendered in the app"
                    {...field}
                    disabled={pending}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          variant={"default"}
          disabled={pending || !isValid}
        >
          {isEdit ? "Update Page" : "Create Page"}
        </Button>
      </div>
    </form>
  );
}
