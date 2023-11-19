import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Logo = ({ showInMobile }: { showInMobile?: boolean }) => {
  return (
    <div
      className={cn(
        "hidden md:flex items-center gap-x-2",
        showInMobile && "flex",
      )}
    >
      <Image
        src={"/logo.svg"}
        alt={"Logo"}
        height="20"
        width="20"
        className="dark:hidden"
      />
      <Image
        src={"/logo-dark.svg"}
        alt={"Logo"}
        height="20"
        width="20"
        className="hidden dark:block"
      />
      <p className={cn("font-semibold", font.className)}>Notes</p>
    </div>
  );
};

export default Logo;
