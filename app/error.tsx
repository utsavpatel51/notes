'use client';

import { Button } from '@/components/ui/button';
import { Undo2Icon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Error = () => {
  const router = useRouter();

  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-y-2'>
      <Image src={'/error.svg'} alt='Error' height={300} width={300} />
      <h2 className='text-lg font-medium'>Something went wrong!</h2>

      <Button className='mt-6' onClick={router.back}>
        <Undo2Icon className='mr-2 h-4 w-4' />
        Go Back
      </Button>
    </div>
  );
};

export default Error;
