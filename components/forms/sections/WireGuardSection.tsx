"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TextInput from "../fields/TextInput";
import type { Control } from "react-hook-form";
import { ServerFormValues } from "@/lib/validation";

const WireGuardSection = ({
  control,
}: {
  control: Control<ServerFormValues>;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>WireGuard Configuration</CardTitle>
        <CardDescription>
          Configure WireGuard settings for this server
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TextInput
          control={control}
          name="wireguard_config.address"
          label="Address"
          placeholder="Enter address"
        />
        <TextInput
          control={control}
          name="wireguard_config.config"
          label="Config"
          placeholder="Enter config"
          type="textarea"
        />
      </CardContent>
    </Card>
  );
};

export default WireGuardSection;
