import Header from '@/app/(home)/_components/header';
import Hero from '@/app/(home)/_components/hero';
import Footer from '@/app/(home)/_components/footer';

const MarketingPage = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center md:justify-start'>
        <Header />
        <Hero />
      </div>
      <Footer />
    </div>
  );
};

export default MarketingPage;
