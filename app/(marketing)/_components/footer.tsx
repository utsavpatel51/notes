import Logo from "@/app/(marketing)/_components/logo";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <div className="flex items-center w-full bg-background dark:bg-[#1f1f1f] p-6">
      <Logo />
      <div className="md:ml-auto w-full flex items-center justify-between md:justify-end gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
        <Button variant="ghost" size="sm">
          Terms & Condition
        </Button>
      </div>
    </div>
  );
};

export default Footer;
