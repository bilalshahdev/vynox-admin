import { cn } from "@/lib/utils";

const ResponseError = ({
  error = "Something went wrong",
  className,
}: {
  error?: string;
  className?: string;
}) => {
  return (
    <p className={cn("text-xs flex h-full items-center justify-center text-red-500", className)}>
      {error}
    </p>
  );
};

export default ResponseError;
