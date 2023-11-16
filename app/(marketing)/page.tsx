import Heading from "@/app/(marketing)/_components/heading";
import Hero from "@/app/(marketing)/_components/hero";
import Footer from "@/app/(marketing)/_components/footer";

const MarketingPage = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <Heading />
        <Hero />
      </div>
      <Footer />
    </div>
  );
};

export default MarketingPage;
