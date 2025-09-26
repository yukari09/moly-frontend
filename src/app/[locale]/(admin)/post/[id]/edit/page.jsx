'use client';

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eraser, Undo, Redo, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TagInput } from "@/components/ui/tag-input";
import { useRouter, useParams, useSearchParams } from 'next/navigation';

const Editor = dynamic(() => import('../../new/editor'), {
  ssr: false,
});

const editPostSchema = z.object({
  postTitle: z.string().min(3, { message: "postTitle must be at least 3 characters long" }),
  postContent: z.string().min(6, { message: "postContent must be at least 6 characters long" }),
  postExcerpt: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
});

const generateSlug = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const buildCategoryTree = (categories) => {
    const categoryMap = new Map();
    const tree = [];
    categories.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [] });
    });
    categoryMap.forEach(category => {
        const parentId = category.termTaxonomy?.[0]?.parent_id;
        if (parentId && categoryMap.has(parentId)) {
            categoryMap.get(parentId).children.push(category);
        } else {
            tree.push(category);
        }
    });
    return tree;
};

const CategoryCheckboxItem = ({ category, level = 0, selectedCategories, onCategoryChange }) => {
    const taxonomyId = category.termTaxonomy?.[0]?.id;
    if (!taxonomyId) return null;

    const indentStyle = { paddingLeft: `${level * 1.5}rem` };
    const checkboxId = `category-${taxonomyId}`;

    return (
        <>
            <div key={taxonomyId} className="flex items-center space-x-2 py-1" style={indentStyle}>
                <Checkbox
                    id={checkboxId}
                    checked={selectedCategories.includes(taxonomyId)}
                    onCheckedChange={() => onCategoryChange(taxonomyId)}
                />
                <Label htmlFor={checkboxId} className="font-normal cursor-pointer">
                    {category.name}
                </Label>
            </div>
            {category.children?.map(child => (
                <CategoryCheckboxItem
                    key={child.termTaxonomy?.[0]?.id}
                    category={child}
                    level={level + 1}
                    selectedCategories={selectedCategories}
                    onCategoryChange={onCategoryChange}
                />
            ))}
        </>
    );
};

export default function PostEditPage() {
  const [editorData, setEditorData] = useState(null);
  const [initialContent, setInitialContent] = useState(null);
  const editorRef = useRef(null);
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;

  const form = useForm({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      postTitle: "",
      postContent: "",
      postExcerpt: "",
      categories: [],
      tags: []
    },
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { isSubmitting, isValid, isDirty }, setValue, watch, control, reset } = form;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [postResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/admin/posts/${id}`),
          fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ limit: 1000 }),
          })
        ]);

        if (!postResponse.ok) throw new Error('Failed to fetch post data.');
        if (!categoriesResponse.ok) throw new Error('Failed to load categories.');

        const post = await postResponse.json();
        const categoriesData = await categoriesResponse.json();

        setAllCategories(categoriesData.results || []);

        const initialData = {
            postTitle: post.postTitle,
            postContent: post.postContent,
            postExcerpt: post.postExcerpt || '',
            categories: post.categories.map(c => c.termTaxonomy[0].id),
            tags: post.postTags.map(t => t.name)
        };

        reset(initialData);
        
        if (post.postContent) {
            const parsedContent = JSON.parse(post.postContent);
            setInitialContent(parsedContent);
            setEditorData(parsedContent);
        }

      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, reset]);

  const categoryTree = useMemo(() => buildCategoryTree(allCategories), [allCategories]);
  const watchedCategories = watch("categories", []);

  const handleCategoryChange = (categoryId) => {
    const currentCategories = watchedCategories;
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    setValue("categories", newCategories, { shouldValidate: true, shouldDirty: true });
  };

  const onDataChange = useCallback((data) => {
    const content = JSON.stringify(data);
    setValue("postContent", content, { shouldValidate: true, shouldDirty: true });
    setEditorData(data);
  }, [setValue]);

  const handleSubmission = async (data, status) => {
    const tagNames = data.tags || [];
    const formattedTags = tagNames.map(tagName => {
        const slug = generateSlug(tagName);
        return JSON.stringify({
            name: tagName,
            slug: slug,
            term_taxonomy: [{ taxonomy: 'post_tag' }]
        });
    });

    const payload = {
        id: id,
        ...data,
        tags: formattedTags,
        postStatus: status,
    };

    try {
      const response = await fetch('/api/admin/posts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${status === 'draft' ? 'save draft' : 'update post'}.`);
      }

      toast.success(`Post ${status === 'draft' ? 'saved' : 'updated'} successfully!`);
      // router.push('/admin/content/posts');
      // router.refresh();
      history.back(-1)

    } catch (error) {
      toast.error(error.message);
    }
  }

  const onSubmit = (data) => handleSubmission(data, 'publish');

  const onSaveDraft = (data) => handleSubmission(data, 'draft');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[100vh] overflow-hidden">
        <div className="h-[64px] border-b px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="logo" width="32" height="32" />
            </div>
            <div className="flex items-center">
                <Button size="sm" variant="ghost" onClick={handleSubmit(onSaveDraft)} disabled={!isDirty || isSubmitting}>Save Changes</Button>
                <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={!isDirty || isSubmitting}>Update</Button>
            </div>
        </div>

        <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-top justify-between mx-auto h-[calc(100vh-4rem)]">
                <div className="flex-1 h-full overflow-y-scroll">
                    <div className="mx-auto lg:w-[840px] ">
                        <div className="w-[650px] mx-auto mt-12">
                            <textarea {...register("postTitle")} placeholder='Add a title' className="w-full !border-0 !p-0 !text-4xl font-bold field-sizing-content !outline-none break-words resize-none overflow-hidden" disabled={isSubmitting}/>
                            <Editor 
                                holder="editor-container" 
                                placeholder="Type text or paste a link" 
                                onDataChange={onDataChange} 
                                className="pt-8 prose" 
                                editorRef={editorRef} 
                                initialData={initialContent}
                            />
                        </div>
                    </div>
                </div>
                <div className="right-0 w-[384px] h-[calc(100vh-65px)] border-l">

                  <div className="p-2 border-b">
                    <FormField
                      control={control}
                      name="postExcerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea rows="5" className="my-2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="p-2 border-b">
                    <Label>Categories</Label>
                    <div className="max-h-48 overflow-y-scroll py-2 space-y-1">
                        {categoryTree.length > 0 ? (
                            categoryTree.map(category => (
                                <CategoryCheckboxItem
                                    key={category.id}
                                    category={category}
                                    selectedCategories={watchedCategories}
                                    onCategoryChange={handleCategoryChange}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground p-2">Loading categories...</p>
                        )}
                    </div>
                  </div>

                  <div className="p-2 border-b">
                    <FormField
                      control={control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <TagInput
                              placeholder="Enter a tag..."
                              value={field.value || []}
                              onChange={field.onChange}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormDescription>Add tags to your post.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                </div>
            </div>
        </form>
        </Form>
    </div>
  );
}