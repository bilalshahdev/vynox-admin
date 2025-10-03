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
import PasswordInput from "../fields/PasswordInput";

const OpenVPNSection = ({
  control,
}: {
  control: Control<ServerFormValues>;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>OpenVPN Configuration</CardTitle>
        <CardDescription>
          Configure OpenVPN settings for this server
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            control={control}
            name="openvpn_config.username"
            label="Username"
            placeholder="Enter username"
          />
          <PasswordInput
            control={control}
            name="openvpn_config.password"
            label="Password"
            placeholder="Enter password"
          />
        </div>
        <TextInput
          control={control}
          name="openvpn_config.config"
          label="Config"
          placeholder="Enter config"
          type="textarea"
        />
      </CardContent>
    </Card>
  );
};

export default OpenVPNSection;
