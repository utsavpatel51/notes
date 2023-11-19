'use client';
import { useTheme } from 'next-themes';
import { Theme } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React from 'react';
import EmojiPickerReact from 'emoji-picker-react';

interface Props {
  onChange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
}
const EmojiPicker = ({ onChange, children, asChild }: Props) => {
  const { resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || 'light') as keyof typeof themeMap;

  const themeMap = {
    dark: Theme.DARK,
    light: Theme.LIGHT,
  };

  const theme = themeMap[currentTheme];

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className='w-full border-none p-0 shadow-none'>
        <EmojiPickerReact
          height={350}
          theme={theme}
          onEmojiClick={(icon) => onChange(icon.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};
export default EmojiPicker;
