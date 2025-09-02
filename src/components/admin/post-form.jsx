'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
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

export function PostForm({ initialData = null, allCategories = [], allTags = [], title, description }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state directly from props
  const [postTitle, setPostTitle] = useState(initialData?.postTitle || '');
  const [postContent, setPostContent] = useState(() => {
    if (!initialData?.postContent) return [{ type: 'p', children: [{ text: '' }] }];
    try {
      const parsed = JSON.parse(initialData.postContent);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [{ type: 'p', children: [{ text: '' }] }];
    } catch {
      return [{ type: 'p', children: [{ text: '' }] }];
    }
  });
  const [selectedCategory, setSelectedCategory] = useState(initialData?.categories?.[0]?.termTaxonomy?.[0]?.id || null);
  const [selectedTags, setSelectedTags] = useState(() => initialData?.postTags?.map(tag => ({ value: tag.name, label: tag.name })) || []);

  const isEditMode = !!initialData?.id;

  const editor = usePlateEditor({
    id: initialData?.id || 'new-post',
    plugins: [
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      H1Plugin.withComponent(H1Element),
      H2Plugin.withComponent(H2Element),
      H3Plugin.withComponent(H3Element),
      BlockquotePlugin.withComponent(BlockquoteElement),
    ],
    value: postContent
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const payload = {
      postTitle,
      postContent: JSON.stringify(postContent),
    };

    if (selectedCategory) {
      payload.categories = [selectedCategory];
    }

    if (selectedTags && selectedTags.length > 0) {
      payload.tags = selectedTags.map((tag) => JSON.stringify({ name: tag.value, slug: tag.value, term_taxonomy: [{taxonomy: "post_tag"}] }));
    }

    const url = isEditMode ? '/api/admin/posts/update' : '/api/admin/posts/new';
    const body = isEditMode ? { id: initialData.id, ...payload } : payload;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} post.`);
      }

      toast.success(`Post ${isEditMode ? 'updated' : 'created'} successfully!`);
      router.push('/admin/content/posts');
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="pb-4 border-b flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground pt-1">{description}</p>
        </div>
        <Button type="submit" size="sm" disabled={isLoading || !postContent}>
          {isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Save')}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4 items-start mt-6">
        <div className="space-y-6 col-span-2">
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
            <div className="grid gap-2">
              <div className="rounded-lg max-w-full border">
                {postContent && (
                  <Plate 
                    editor={editor}
                    onChange={(newValue) => setPostContent(newValue.value)}
                  >
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
                      <Editor className="!p-4 break-all min-h-[350px]" placeholder="Type your amazing content here..." />
                    </EditorContainer>
                  </Plate>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border divide-y space-y-4 [&>*]:pb-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select onValueChange={setSelectedCategory} {...(selectedCategory ? { value: selectedCategory } : {})}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {allCategories
                  .filter(category => category.termTaxonomy?.[0]?.id)
                  .map((category) => (
                    <SelectItem key={category.termTaxonomy?.[0]?.id} value={category.termTaxonomy?.[0]?.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <SelectEditor
              items={[
                ...new Map(
                  allTags.map(tag => [tag.name, { value: tag.name, label: tag.name }])
                ).values()
              ]}
              value={selectedTags}
              onValueChange={setSelectedTags}
            >
              <SelectEditorContent>
                <SelectEditorInput placeholder="Select tags..." />
                <SelectEditorCombobox />
              </SelectEditorContent>
            </SelectEditor>
          </div>
        </div>
      </div>
    </form>
  );
}