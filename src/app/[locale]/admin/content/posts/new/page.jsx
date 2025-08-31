'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { useSession } from "next-auth/react";

import {
  BlockquotePlugin,
  BoldPlugin,
  H2Plugin,
  H3Plugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react';
import {
  Plate,
  usePlateEditor,
} from 'platejs/react';
import { BlockquoteElement } from '@/components/ui/blockquote-node';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { H2Element, H3Element } from '@/components/ui/heading-node';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';
import { ToolbarButton } from '@/components/ui/toolbar'; // Generic toolbar button

const initialValue = [
  {
    children: [{ text: 'Title' }],
    type: 'h3',
  },
  {
    children: [{ text: 'This is a quote.' }],
    type: 'blockquote',
  },
  {
    children: [
      { text: 'With some ' },
      { bold: true, text: 'bold' },
      { text: ' text for emphasis!' },
    ],
    type: 'p',
  },
];

export default function PostNewPage() {

  const router = useRouter();
  const { data: session } = useSession();
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ limit: 100, offset: 0 }) }),
          fetch('/api/admin/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ limit: 100, offset: 0 }) }),
        ]);
        const [categoriesData, tagsData] = await Promise.all([
          categoriesRes.json(),
          tagsRes.json(),
        ]);
        setCategories(categoriesData.results);
        setTags(tagsData.results);
      } catch (error) {
        toast.error('Failed to fetch categories or tags.');
      }
    };
    fetchTerms();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const response = await fetch('/api/admin/posts/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        postTitle, 
        postContent,
        categories: selectedCategories,
        tags: selectedTags,
      }),
    });

    setIsLoading(false);

    if (response.ok) {
      toast.success('Post created successfully!');
      router.push('/admin/content/posts');
      router.refresh();
    } else {
      const data = await response.json();
      toast.error(data.error || 'Failed to create post.');
    }
  };

  const editor = usePlateEditor({
    plugins: [
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      H2Plugin.withComponent(H2Element),
      H3Plugin.withComponent(H3Element),
      BlockquotePlugin.withComponent(BlockquoteElement),
    ],
    value: initialValue,
  });

  return (

    <div className="p-4 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Post</h1>
          <p className="text-muted-foreground pt-1">
            Create a new post.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Input
              id="postTitle"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Title"
              required
              autoFocus
            />
          </div>
          <div>
            <Button size="sm" variant="secondary" type="button" className="rounded-full">Add Tags</Button>
          </div>
          <div className="grid gap-2">
            <div className="rounded-xl border bg-background">
              <Plate 
                editor={editor}
                onChange={({ value }) => {
                  localStorage.setItem('installation-next-demo', JSON.stringify(value));
                }}
              >
                <FixedToolbar className="flex justify-start gap-1 rounded-t-xl">
                  {/* Element Toolbar Buttons */}
                  <ToolbarButton onClick={() => editor.tf.h2.toggle()}>H2</ToolbarButton>
                  <ToolbarButton onClick={() => editor.tf.h3.toggle()}>H3</ToolbarButton>
                  <ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>Quote</ToolbarButton>
                  {/* Mark Toolbar Buttons */}
                  <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">B</MarkToolbarButton>
                  <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">I</MarkToolbarButton>
                  <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">U</MarkToolbarButton>
                </FixedToolbar>
                <EditorContainer>
                  <Editor className="!p-4 break-all h-[350px] overflow-y-auto" placeholder="Type your amazing content here..." />
                </EditorContainer>
              </Plate>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
        </div>
      </form>
    </div>    
  );
}