'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditTagPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchTag = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/admin/tags/${id}`);
          if (!response.ok) throw new Error('Failed to fetch tag data.');
          const tag = await response.json();
          setName(tag.name);
          setSlug(tag.slug);
          setDescription(tag.termTaxonomy[0]?.description || '');
        } catch (error) {
          toast.error(error.message);
        }
        setIsLoading(false);
      };
      fetchTag();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update tag.');
      }

      toast.success('Tag updated successfully!');
      router.push('/admin/content/tags');
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Tag</h1>
          <p className="text-muted-foreground pt-1">Update the details for this tag.</p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of the tag."
            />
          </div>
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
