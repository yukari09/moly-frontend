'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { CategoryForm } from '../../category-form';
import { getTermValue } from '@/lib/utils';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [initialData, setInitialData] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCategoryData = async () => {
        setIsLoading(true);
        try {
          const categoryResponse = await fetch(`/api/admin/categories/${id}`);
          if (!categoryResponse.ok) throw new Error('Failed to fetch category data.');
          const category = await categoryResponse.json();
          
          const allCategoriesResponse = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ limit: 1000 }),
          });
          if (!allCategoriesResponse.ok) throw new Error('Failed to load categories list.');
          const allCategoriesData = await allCategoriesResponse.json();

          setInitialData({
            name: category.name,
            slug: category.slug,
            description: category.termTaxonomy?.[0]?.description || '',
            parentId: category.termTaxonomy?.[0]?.parent?.id || '',
            show_in_menu: getTermValue(category.termMeta, 'show_in_menu') === '1',
          });
          
          setParentCategories(allCategoriesData.results.filter(c => c.id !== id));

        } catch (error) {
          toast.error(error.message);
        }
        setIsLoading(false);
      };
      fetchCategoryData();
    }
  }, [id]);

  const handleSubmit = async (data) => {
    setIsSaving(true);

    const finalParentId = (data.parentId && data.parentId !== 'none') ? data.parentId : null;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, parentId: finalParentId }),
      });

      if (!response.ok) {
        const apiError = await response.json();
        throw new Error(apiError.error || 'Failed to update category.');
      }

      toast.success('Category updated successfully!');
      router.push('/admin/content/categories');
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl">
       <div>
          <h1 className="text-2xl font-bold">Edit Category</h1>
          <p className="text-muted-foreground pt-1">Update the details for this category.</p>
        </div>
        <div className="pt-6">
          {isLoading || !initialData ? (
             <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <CategoryForm 
              onSubmit={handleSubmit}
              initialData={initialData}
              parentCategories={parentCategories}
              isSaving={isSaving}
              isEdit={true}
            />
          )}
        </div>
    </div>
  );
}