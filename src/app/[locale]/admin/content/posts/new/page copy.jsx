'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { useSession } from "next-auth/react";

export default function NewPostPage() {
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
            <Label htmlFor="postTitle">Title</Label>
            <Input
              id="postTitle"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="postContent">Content</Label>
          </div>
          <div className="grid gap-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => {
                      setSelectedCategories(
                        checked
                          ? [...selectedCategories, category.id]
                          : selectedCategories.filter((id) => id !== category.id)
                      );
                    }}
                  />
                  <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Tags</Label>
            <Input
              id="tags"
              placeholder="Enter comma-separated tags"
              onChange={(e) => setSelectedTags(e.target.value.split(',').map(tag => tag.trim()))}
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Post'}
        </Button>
      </form>
    </div>
  );
}
