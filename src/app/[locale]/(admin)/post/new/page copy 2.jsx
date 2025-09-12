'use client';

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eraser, Undo, Redo } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag, TagInput } from 'emblor';
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const Editor = dynamic(() => import('./editor'), {
  ssr: false,
});

const createPostSchema = z.object({
  postTitle: z.string().min(3, { message: "postTitle must be at least 3 characters long" }),
  postContent: z.string().min(6, { message: "postContent must be at least 6 characters long" }),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
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
    const indentStyle = { paddingLeft: `${level * 1.5}rem` };
    const checkboxId = `category-${category.id}`;

    return (
        <>
            <div key={category.id} className="flex items-center space-x-2 py-1" style={indentStyle}>
                <Checkbox
                    id={checkboxId}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => onCategoryChange(category.id)}
                />
                <Label htmlFor={checkboxId} className="font-normal cursor-pointer">
                    {category.name}
                </Label>
            </div>
            {category.children?.map(child => (
                <CategoryCheckboxItem
                    key={child.id}
                    category={child}
                    level={level + 1}
                    selectedCategories={selectedCategories}
                    onCategoryChange={onCategoryChange}
                />
            ))}
        </>
    );
};

export default function PostNewPage() {
  const [tags, setTags] = useState([]);
  const [editorData, setEditorData] = useState(null);
  const [undoData, setUndoData] = useState([]);
  const [redoData, setRedoData] = useState([]);
  const editorRef = useRef(null);
  const [allCategories, setAllCategories] = useState([]);

  const form = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      postTitle: "",
      postContent: "",
      categories: [],
      tags: [],
    },
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { isSubmitting, isValid }, setValue, watch, control } = form;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 1000 }),
        });
        if (!response.ok) throw new Error('Failed to load categories.');
        const data = await response.json();
        setAllCategories(data.results || []);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchCategories();
  }, []);

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
    if (editorRef.current?.isProgrammaticChange) {
        editorRef.current.isProgrammaticChange = false;
        return;
    }
    const content = JSON.stringify(data);
    setValue("postContent", content, { shouldValidate: true, shouldDirty: true });
    setEditorData(data);
    setUndoData(prev => [...prev, data]);
    setRedoData([]);
  }, [setValue]);

  const updateFormOnUndoRedo = (data) => {
    const content = JSON.stringify(data);
    setValue("postContent", content, { shouldValidate: true, shouldDirty: true });
  };

  const handleUndo = () => {
    if (undoData.length > 1) {
      const newUndoData = undoData.slice(0, -1);
      setUndoData(newUndoData);
      
      const previousData = newUndoData[newUndoData.length - 1];
      setRedoData(prev => [editorData, ...prev]);
      setEditorData(previousData);
      updateFormOnUndoRedo(previousData);

      if (editorRef.current) {
        editorRef.current.isProgrammaticChange = true;
        editorRef.current.render(previousData);
      }
    }
  }
  
  const handleRedo = () => {
    if (redoData.length > 0) {
      const [redoState, ...remainingRedo] = redoData;
      setUndoData(prev => [...prev, redoState]);
      setEditorData(redoState);
      setRedoData(remainingRedo);
      updateFormOnUndoRedo(redoState);

      if (editorRef.current) {
        editorRef.current.isProgrammaticChange = true;
        editorRef.current.render(redoState);
      }
    }
  }

  const handleSubmission = (data) => {
    const tagObjects = data.tags || [];
    const formattedTags = tagObjects.map(tag => {
        const slug = generateSlug(tag.text);
        return JSON.stringify({
            name: tag.text,
            slug: slug,
            term_taxonomy: [{ taxonomy: 'post_tag' }]
        });
    });

    const payload = {
        ...data,
        tags: formattedTags,
    };

    return payload;
  }

  const onSubmit = (data) => {
    const payload = handleSubmission(data);
    console.log("Publishing Post:", payload);
    // TODO: Implement public submission logic using the payload
  }

  const onSaveDraft = (data) => {
    const payload = handleSubmission(data);
    console.log("Saving Draft:", payload);
    // TODO: Implement draft submission logic using the payload
  }

  return (
    <div className="h-[100vh] overflow-hidden">
        <div className="h-[64px] border-b px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="logo" width="32" height="32" />
                <Button onClick={handleUndo} variant="ghost" size="sm"  disabled={undoData.length < 2 || isSubmitting}><Undo className="size-4" /></Button>
                <Button onClick={handleRedo} variant="ghost" size="sm"   disabled={redoData.length === 0  || isSubmitting}><Redo className="size-4" /></Button>
            </div>
            <div className="flex items-center">
                <Button size="sm" variant="ghost" onClick={handleSubmit(onSaveDraft)} disabled={!isValid || isSubmitting}>Save draft</Button>
                <Button size="sm" variant="ghost" className="mr-3" disabled={isSubmitting}><Eraser className="size-4" />Clear</Button>
                <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={!isValid || isSubmitting}>Public</Button>
            </div>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-top justify-between mx-auto h-[calc(100vh-4rem)]">
                  <div className="flex-1 h-full overflow-y-scroll">
                      <div className="mx-auto lg:w-[840px] ">
                          <div className="w-[650px] mx-auto mt-12">
                              <textarea {...register("postTitle")} placeholder='Add a title' className="w-full !border-0 !p-0 !text-4xl font-bold field-sizing-content !outline-none break-words resize-none overflow-hidden" disabled={isSubmitting}/>
                              <Editor holder="editor-container" placeholder="Type text or paste a link" onDataChange={onDataChange} className="pt-8 prose" editorRef={editorRef} />
                          </div>
                      </div>
                  </div>
                  <div className="right-0 w-[384px] h-[calc(100vh-65px)] border-l">

                    <div className="p-2 border-b">
                      <Label className="p-2">Excerpt</Label>
                       <Textarea name="postExcerpt" rows="5" className="my-2"></Textarea>
                    </div>

                    <div className="p-2 border-b">
                      <Label className="p-2">Categories</Label>
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
                      <Label className="p-2">Tags</Label>
                      <FormField
                        control={control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem className="my-2">
                            <FormControl>
                              <TagInput
                                {...field}
                                placeholder="Enter a topic"
                                tags={tags}
                                setTags={(newTags) => {
                                  setTags(newTags);
                                  setValue("tags", newTags, { shouldValidate: true });
                                }}
                              />
                            </FormControl>
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