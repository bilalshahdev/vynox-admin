import { cn } from "@/lib/utils";
import Brand from "./Brand";

const Loading = ({ className }: { className?: string }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "absolute h-16 w-16 rounded-full border-2 border-signature opacity-40 animate-ping",
            className
          )}
        />
        <div
          className={cn(
            "absolute h-12 w-12 rounded-full border-2 border-signature/60 animate-spin-slow",
            className
          )}
        />
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-signature text-white shadow-lg animate-pulse">
          <Brand size={6} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
