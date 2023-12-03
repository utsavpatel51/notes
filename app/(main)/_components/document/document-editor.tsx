'use client';
import React from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';
import { useTheme } from 'next-themes';
import { useEdgeStore } from '@/lib/edgestore';
import * as Y from 'yjs';
import YPartyKitProvider from 'y-partykit/provider';
import { useUser } from '@clerk/clerk-react';
import { COLORS } from '@/lib/constants';

const doc = new Y.Doc();
const provider = new YPartyKitProvider(
  process.env.NEXT_PUBLIC_PARTYKIT_HOST as string,
  'blocknote-notes',
  doc,
);
interface Props {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const DocumentEditor = ({ initialContent, onChange, editable }: Props) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const { user } = useUser();

  const handleImageUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });

    return response.url;
  };

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleImageUpload,
    collaboration: {
      provider: provider,
      fragment: doc.getXmlFragment('blocknote'),
      user: {
        name: user?.firstName || 'Anonymous',
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      },
    },
  });

  return (
    <div>
      <BlockNoteView editor={editor} theme={resolvedTheme === 'dark' ? 'dark' : 'light'} />
    </div>
  );
};

export default DocumentEditor;
