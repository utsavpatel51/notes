'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useSettingStore from '@/store/useSetting';
import { Label } from '@/components/ui/label';
import ThemeToggle from '@/components/modals/theme-toggle';

const SettingModal = () => {
  const settingStore = useSettingStore();

  return (
    <Dialog open={settingStore.isOpen} onOpenChange={settingStore.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription className='text-sm'>Personalize Notes for you</DialogDescription>
        </DialogHeader>
        <div className='w-full border'></div>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-y-1'>
            <Label>Appearance</Label>
            <span className='text-xs text-muted-foreground'>
              Customize how Notes looks on your device
            </span>
          </div>
          <ThemeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingModal;
