import { cn } from "@/lib/utils";
import Image from "next/image";

const Brand = ({
  width = 100,
  height = 100,
  size = 10,
}: {
  width?: number;
  height?: number;
  size?: 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20;
}) => {
  return (
    <>
      <Image
        src="/logo.png"
        alt="logo"
        width={width}
        height={height}
        className={cn("dark:block hidden", `w-${size}`)}
      />
      <Image
        src="/logo.png"
        alt="logo"
        width={width}
        height={height}
        className={cn("w-6 invert dark:hidden", `w-${size}`)}
      />
    </>
  );
};

export default Brand;
