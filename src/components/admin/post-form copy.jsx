'use client';

import { useState, useEffect } from 'react';
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

export function PostForm({ initialData = null, title, description }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [termsLoaded, setTermsLoaded] = useState(false);

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
    value: postContent || [],
    onChange: (value) => {
      setPostContent(value);
    },
  });

  useEffect(() => {
    if (initialData && termsLoaded) {
      setPostTitle(initialData.postTitle || '');
      setSelectedCategory(initialData.categories?.[0]?.termTaxonomy?.[0]?.id || null);
      setSelectedTags(initialData.post_tags?.map(tag => ({ value: tag.name, label: tag.name })) || []);

      if (initialData.postContent) {
        try {
          const parsedContent = JSON.parse(initialData.postContent);
          if (Array.isArray(parsedContent) && parsedContent.length > 0) {
            setPostContent(parsedContent);
          } else {
            setPostContent([{ type: 'p', children: [{ text: '' }] }]);
          }
        } catch (e) {
          setPostContent([{ type: 'p', children: [{ text: initialData.postContent }] }]);
        }
      } else {
        setPostContent([{ type: 'p', children: [{ text: '' }] }]);
      }
    } else if (termsLoaded) {
      setPostContent([{ type: 'p', children: [{ text: '' }] }]);
    }
  }, [initialData, termsLoaded]);

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
      } finally {
        setTermsLoaded(true);
      }
    };
    fetchTerms();
  }, []);

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
                      <Editor className="!p-4 break-all max-h-[350px]" placeholder="Type your amazing content here..." />
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
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories
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
        </div>
      </div>
    </form>
  );
}
