"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  useAddServer,
  useGetServer,
  useUpdateServer,
} from "@/hooks/useServers";
import { ServerFormValues, serverSchema } from "@/lib/validation";

import GeneralSection from "./sections/GeneralSection";
import OpenVPNSection from "./sections/OpenVPNSection";
import WireGuardSection from "./sections/WireGuardSection";

const defaultValues: ServerFormValues = {
  general: {
    name: "",
    ip: "",
    country_id: "",
    city_id: "",
    categories: [],
    os_type: "android",
    is_pro: false,
    mode: "test",
  },
  openvpn_config: {
    username: "",
    password: "",
    config: "",
  },
  wireguard_config: {
    address: "",
    config: "",
  },
};

export default function ServerForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = Boolean(id);

  const methods = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { handleSubmit, reset, control } = methods;

  const { data: serverResp } = useGetServer(id ?? "", { enabled: isEdit });
  const server = serverResp?.data;

  useEffect(() => {
    if (!server) return;
    reset({
      general: {
        name: server.name,
        categories: server.categories ?? [],
        country_id: server.country_id ?? "",
        city_id: server.city_id ?? "",
        ip: server.ip,
        os_type: server.os_type,
        is_pro: server.is_pro,
        mode: server.mode,
      },
      openvpn_config: {
        username: server.openvpn_config?.username ?? "",
        password: server.openvpn_config?.password ?? "",
        config: server.openvpn_config?.config ?? "",
      },
      wireguard_config: {
        address: server.wireguard_config?.address ?? "",
        config: server.wireguard_config?.config ?? "",
      },
    });
  }, [server, reset]);

  const { mutateAsync: addServer, isPending: adding } = useAddServer();
  const { mutateAsync: editServer, isPending: updating } = useUpdateServer();

  const onSubmit = async (values: ServerFormValues) => {
    try {
      if (isEdit && id) {
        await editServer({ id, data: values });
      } else {
        await addServer(values);
      }
      startTransition(() => router.replace("/servers"));
      router.refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="openvpn">OpenVPN</TabsTrigger>
            <TabsTrigger value="wireguard">WireGuard</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSection
              control={control}
              country={server?.country}
              city={server?.city}
            />
          </TabsContent>

          <TabsContent value="openvpn">
            <OpenVPNSection control={control} />
          </TabsContent>

          <TabsContent value="wireguard">
            <WireGuardSection control={control} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="submit" disabled={adding || updating}>
            {isEdit ? "Update Server" : "Create Server"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
