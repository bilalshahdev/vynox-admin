import { Smartphone, Tablet } from "lucide-react";

const OSType = ({ os_type }: { os_type: "android" | "ios" }) => {
  return (
    <div className="flex items-center gap-1">
      {os_type === "android" ? (
        <Smartphone className="h-4 w-4 text-green-600" />
      ) : (
        <Tablet className="h-4 w-4 text-blue-600" />
      )}
      <span className="capitalize text-xs">{os_type}</span>
    </div>
  );
};

export default OSType;
