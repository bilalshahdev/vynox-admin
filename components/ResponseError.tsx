import { cn } from "@/lib/utils";
import { XS } from "../../ajar/src/components/Typography";

const ResponseError = ({
  error = "Something went wrong",
  className,
}: {
  error?: string;
  className?: string;
}) => {
  return (
    <XS className={cn("flex h-full items-center justify-center text-red-500", className)}>
      {error}
    </XS>
  );
};

export default ResponseError;
