import Image from "next/image";

const Hero = () => {
  return (
    <div className="flex">
      <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
        <Image
          src={"/hero.svg"}
          alt={"Documents"}
          fill
          className="object-contain dark:hidden"
        />
        <Image
          src={"/hero-dark.svg"}
          alt={"Documents"}
          fill
          className="object-contain hidden dark:block"
        />
      </div>
    </div>
  );
};

export default Hero;
