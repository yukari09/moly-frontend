'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSession } from "next-auth/react";
import {
  BlockquotePlugin,
  BoldPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react';
import { Plate, usePlateEditor } from 'platejs/react';
import { BlockquoteElement } from '@/components/ui/blockquote-node';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { H1Element, H2Element, H3Element } from '@/components/ui/heading-node';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';
import { ToolbarButton } from '@/components/ui/toolbar';
import { SelectEditor, SelectEditorContent, SelectEditorInput, SelectEditorCombobox } from '@/components/ui/select-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PostNewPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const editor = usePlateEditor({
    plugins: [
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      H1Plugin.withComponent(H1Element),
      H2Plugin.withComponent(H2Element),
      H3Plugin.withComponent(H3Element),
      BlockquotePlugin.withComponent(BlockquoteElement),
    ],
    value: postContent,
    onChange: (value) => {
      setPostContent(value);
    },
  });

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
        setTags(tagsData.results.map((tag) => ({ value: tag.name, label: tag.name })));
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
        postContent: JSON.stringify(postContent),
        categories: [selectedCategory],
        tags: selectedTags.map((tag) => tag.label),
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

  return (

      <div className="p-4">
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
            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <SelectEditor
                items={tags}
                value={selectedTags}
                onValueChange={setSelectedTags}
              >
                <SelectEditorContent>
                  <SelectEditorInput placeholder="Select tags..." />
                  <SelectEditorCombobox />
                </SelectEditorContent>
              </SelectEditor>
            </div>
            
            <div className="grid gap-2">
              <div className="rounded-lg max-w-full border">
                <Plate editor={editor}>
                  <FixedToolbar className="flex justify-start gap-1 rounded-t-xl">
                    <ToolbarButton onClick={() => editor.tf.h1.toggle()}>H1</ToolbarButton>
                    <ToolbarButton onClick={() => editor.tf.h2.toggle()}>H2</ToolbarButton>
                    <ToolbarButton onClick={() => editor.tf.h3.toggle()}>H3</ToolbarButton>
                    <ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>Quote</ToolbarButton>
                    <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">B</MarkToolbarButton>
                    <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">I</MarkToolbarButton>
                    <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">U</MarkToolbarButton>
                  </FixedToolbar>
                  <EditorContainer>
                    <Editor className="!p-4 break-all" placeholder="Type your amazing content here..." />
                  </EditorContainer>
                </Plate>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
          </div>
        </form>
      </div>    
  );
}