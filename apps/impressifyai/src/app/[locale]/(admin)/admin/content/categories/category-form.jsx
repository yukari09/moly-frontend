'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect, useMemo } from 'react';

const categoryFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  slug: z.string().min(1, { message: 'Slug is required.' }),
  description: z.string().optional(),
  parentId: z.string().optional(),
  show_in_menu: z.boolean().default(false),
});

// Helper function to generate a slug from a string
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

// Helper function to build the category tree
const buildCategoryTree = (categories) => {
  const categoryMap = new Map();
  const tree = [];

  // First pass: map all categories by their ID and initialize children array
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Second pass: build the tree structure
  categoryMap.forEach(category => {
    const parentId = category.termTaxonomy?.[0]?.parent_id;
    if (parentId && categoryMap.has(parentId)) {
      const parent = categoryMap.get(parentId);
      parent.children.push(category);
    } else {
      tree.push(category);
    }
  });

  return tree;
};

// Recursive component to render tree options
const CategoryOption = ({ category, level = 0 }) => {
  const indentStyle = { paddingLeft: `${level * 1.25}rem` };

  return (
    <>
      <SelectItem key={category.id} value={category.id} style={indentStyle}>
        {`- `.repeat(level)}{category.name}
      </SelectItem>
      {category.children?.map(child => (
        <CategoryOption key={child.id} category={child} level={level + 1} />
      ))}
    </>
  );
};

export function CategoryForm({ onSubmit, initialData, parentCategories = [], isSaving = false, isEdit = false }) {
  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      parentId: '',
      show_in_menu: false,
    },
  });

  const nameValue = form.watch('name');
  const isSlugManuallyEdited = form.formState.dirtyFields.slug;

  useEffect(() => {
    if (!isEdit && !isSlugManuallyEdited && nameValue) {
      form.setValue('slug', generateSlug(nameValue));
    }
  }, [nameValue, isSlugManuallyEdited, form, isEdit]);

  const categoryTree = useMemo(() => buildCategoryTree(parentCategories), [parentCategories]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || 'none'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">-- Select Parent Category --</SelectItem>
                    {categoryTree.map(category => (
                      <CategoryOption key={category.id} category={category} />
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A short description of the category."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="show_in_menu"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Show in Menu</FormLabel>
                  <FormDescription>
                    Whether this category should be displayed in navigation menus.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Category')}
        </Button>
      </form>
    </Form>
  );
}