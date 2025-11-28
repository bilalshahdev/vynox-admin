"use client"
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

const XRaySection = ({
    control,
}: {
    control: Control<ServerFormValues>;
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>XRay Configuration</CardTitle>
                <CardDescription>
                    Configure XRay settings for this server
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <TextInput
                    control={control}
                    name="xray_config.shadowsocks"
                    label="Shadowsocks"
                    placeholder="Enter Shadowsocks"
                />
                <TextInput
                    control={control}
                    name="xray_config.vless"
                    label="Vless"
                    placeholder="Enter Vless"
                    type="textarea"
                />
                <TextInput
                    control={control}
                    name="xray_config.vmess"
                    label="VMess"
                    placeholder="Enter VMess"
                    type="textarea"
                />
                <TextInput
                    control={control}
                    name="xray_config.torjan"
                    label="Torjan"
                    placeholder="Enter Torjan"
                    type="textarea"
                />
            </CardContent>
        </Card>
    );
}

export default XRaySection
