import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublishSection from './publish-section';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { GlobeIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import React, { use } from 'react';
import { toast } from 'sonner';

interface Props {
  initial: Doc<'documents'>;
}

const ShareSection = ({ initial }: Props) => {
  const [inviteEmail, setInviteEmail] = React.useState('');
  const shareUserList = useQuery(api.sharedDocuments.getShareUsers, {
    documentId: initial._id as Id<'documents'>,
  });

  const addDocumentAccess = useMutation(api.sharedDocuments.addDocumentAccess);
  const updateDocumentAccess = useMutation(api.sharedDocuments.updateDocumentAccess);

  const handleAddAccess = async () => {
    try {
      await addDocumentAccess({
        documentId: initial._id as Id<'documents'>,
        userEmail: inviteEmail,
        accessLevel: 'write',
      });
      setInviteEmail('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateAccess = async (userEmail: string, accessLevel: 'write' | 'read') => {
    try {
      await updateDocumentAccess({
        documentId: initial._id as Id<'documents'>,
        accessLevel,
        userEmail,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='sm' variant='ghost'>
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-96' align='end' alignOffset={8}>
        <Tabs defaultValue='share' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='share'>Share</TabsTrigger>
            <TabsTrigger value='publish'>
              Publish {initial.isPublished && <GlobeIcon className='ml-2 h-4 w-4 text-sky-500' />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='share'>
            <div className='space-y-3 pt-2'>
              <div className='flex items-center gap-x-2'>
                <Input
                  placeholder='Add people email addresses'
                  className='h-8 w-full bg-secondary px-2 focus-visible:ring-transparent'
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Button size='sm' className='h-8' onClick={handleAddAccess} disabled={!inviteEmail}>
                  Invite
                </Button>
              </div>

              <div>
                <p className='text-[13px] text-muted-foreground'>People with access</p>
                <div className='mt-2'>
                  <div className=' '>
                    {shareUserList?.map((user) => (
                      <div key={user.id} className='flex items-center justify-between'>
                        <div className='flex items-center gap-x-1'>
                          <Avatar className='h-5 w-5'>
                            <AvatarFallback className='text-xs'>
                              {user.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <p className='w-[220px] overflow-hidden text-ellipsis'>{user.email}</p>
                        </div>
                        <div>
                          <Select
                            value={user.accessLevel}
                            onValueChange={(value) =>
                              handleUpdateAccess(user.email, value as 'write' | 'read')
                            }
                          >
                            <SelectTrigger className='w-[110px] border-0 text-[12px] hover:border'>
                              <SelectValue
                                placeholder={user.accessLevel === 'write' ? 'Can Edit' : 'Can View'}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value='write' className='text-[12px]'>
                                  Can Edit
                                </SelectItem>
                                <SelectItem value='read' className='text-[12px]'>
                                  Can View
                                </SelectItem>
                                <SelectItem value='remove' className='text-[12px]'>
                                  Remove
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='publish'>
            <PublishSection initial={initial} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default ShareSection;
