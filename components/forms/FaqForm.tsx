"use client";

import { useAddFaq, useGetFaq, useUpdateFaq } from "@/hooks/useFaqs";
import { faqSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import TextInput from "./fields/TextInput";

const FaqForm = ({
  id,
  closeDialog,
}: {
  id?: string;
  closeDialog?: () => void;
}) => {
  const isEditMode = Boolean(id);

  const { data, isLoading } = useGetFaq(id!, isEditMode);
  const faq = data?.data;

  const methods = useForm<z.infer<typeof faqSchema>>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  const { handleSubmit, control, reset } = methods;

  useEffect(() => {
    if (faq) {
      reset({
        question: faq.question,
        answer: faq.answer,
      });
    }
  }, [faq, reset]);

  const { mutateAsync: addFaqMutation, isPending: addFaqLoading } = useAddFaq();
  const { mutateAsync: updateFaqMutation, isPending: updateFaqLoading } =
    useUpdateFaq();

  if (isEditMode && !faq && !isLoading) {
    toast.error("Faq not found");
    return null;
  }

  const isPending = addFaqLoading || updateFaqLoading;
  const buttonTitle = isLoading
    ? "Loading..."
    : isPending
    ? "Saving..."
    : "Save";

  const onSubmit = async (data: z.infer<typeof faqSchema>) => {
    try {
      if (isEditMode) {
        await updateFaqMutation({ faqId: id!, data });
      } else {
        await addFaqMutation(data);
      }

      reset();
      closeDialog?.();
    } catch (error) {
      console.error("Faq mutation error:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          name="question"
          label="Question"
          placeholder="Enter question"
          control={control}
          disabled={id && isLoading ? true : false}
        />
        <TextInput
          name="answer"
          label="Answer"
          placeholder="Enter answer"
          control={control}
          disabled={id && isLoading ? true : false}
        />
        <Button disabled={isPending} type="submit" variant="button">
          {buttonTitle}
        </Button>
      </form>
    </FormProvider>
  );
};

export default FaqForm;
