'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CategoryForm } from '../category-form';
import { Loader2 } from 'lucide-react';

export default function NewCategoryPage() {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 1000 }),
        });
        if (response.ok) {
          const data = await response.json();
          setParentCategories(data.results);
        } else {
          throw new Error('Failed to load categories list.');
        }
      } catch (error) {
        toast.error(error.message);
      }
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    
    const finalParentId = (data.parentId && data.parentId !== 'none') ? data.parentId : null;

    const response = await fetch('/api/admin/categories/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, parentId: finalParentId }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      toast.success('Category created successfully!');
      router.push('/admin/content/categories');
      router.refresh();
    } else {
      const apiError = await response.json();
      toast.error(apiError.error || 'Failed to create category.');
    }
  };

  return (
    <div className="p-4 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Create New Category</h1>
        <p className="text-muted-foreground pt-1">
          Create a new category for organizing content.
        </p>
      </div>
      <div className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <CategoryForm 
            onSubmit={handleSubmit}
            parentCategories={parentCategories}
            isSaving={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}