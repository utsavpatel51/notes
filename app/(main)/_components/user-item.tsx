import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SignOutButton, useUser } from '@clerk/clerk-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { ChevronsLeftRight } from 'lucide-react';

const UserItem = () => {
  const { user } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div role='button' className='flex w-full items-center p-3  text-sm hover:bg-primary/5'>
          <div className='flex max-w-[150px] items-center gap-x-2'>
            <Avatar className='h-5 w-5'>
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className='line-clamp-1 text-start font-medium'>
              {user?.firstName || user?.username}&apos;s Notes
            </span>
          </div>
          <ChevronsLeftRight className='ml-2 h-4 w-4 rotate-90 text-muted-foreground' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-80' align='start' alignOffset={11} forceMount>
        <div className='flex flex-col space-y-4 p-2'>
          <p className='text-xs font-medium leading-none text-muted-foreground'>
            {user?.emailAddresses[0].emailAddress}
          </p>

          <div className='flex items-center gap-x-2'>
            <Avatar className='h-5 w-5'>
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className='line-clamp-1 text-start font-medium'>
              {user?.firstName || user?.username}&apos;s Notes
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className='w-full cursor-pointer text-muted-foreground'>
          <SignOutButton>Log Out</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserItem;