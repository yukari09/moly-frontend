"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMetaValue } from "@/lib/utils";
import logger from "@/lib/logger";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import debounce from "lodash.debounce";
import {useTranslations} from 'next-intl';

// Debounced username check function
const checkUsernameAvailability = debounce(async (username, originalUsername, resolve) => {
  if (!username || username === originalUsername) return resolve(true);
  try {
    const res = await fetch('/api/user/check-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    resolve(!data.isNotAvailable);
  } catch (error) {
    logger.error("Username check failed:", error);
    resolve(false);
  }
}, 500);

const createProfileSchema = (originalUsername, t) => z.object({
  name: z.string().min(1, t('displayNameRequired')).max(50, t('displayNameMaxLength')),
  username: z.string()
    .min(3, t('usernameMinLength'))
    .max(20, t('usernameMaxLength'))
    .regex(/^[a-z0-9_.]+$/, t('usernamePattern'))
    .superRefine(async (username, ctx) => {
      const isAvailable = await new Promise((resolve) => {
        checkUsernameAvailability(username, originalUsername, resolve);
      });
      if (!isAvailable) {
        ctx.addIssue({
          code: "custom",
          message: t('usernameTaken'),
          path: ["username"],
        });
      }
    }),
  bio: z.string().max(160, t('bioMaxLength')).optional(),
});

export default function ProfilePage() {
  const t = useTranslations('UserProfile');

  const { data: session, update: updateSession } = useSession();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [hostname, setHostname] = useState("");
  const avatarFileRef = useRef(null);

  // @ts-ignore
  const userMeta = session?.user?.userMeta;
  const hasChangedUsername = getMetaValue(userMeta, "has_been_changed_username") === 'true';
  const originalUsername = getMetaValue(userMeta, "username") || "";

  const form = useForm({
    resolver: zodResolver(createProfileSchema(originalUsername, t)),
    defaultValues: {
      name: getMetaValue(userMeta, "name") || "",
      username: originalUsername,
      bio: getMetaValue(userMeta, "bio") || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t('imageTooLargeError', { size: 2 }));
        if (avatarFileRef.current) {
          avatarFileRef.current.value = "";
        }
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values) => {
    const avatarFile = avatarFileRef.current?.files?.[0];
    try {
      const formData = new FormData();

      // Append form values from react-hook-form
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append avatar file if it exists
      if (avatarFile) {
        // A final client-side size check before uploading
        if (avatarFile.size > 2 * 1024 * 1024) {
          toast.error(t('imageTooLargeError', { size: 2 }));
          return;
        }
        formData.append('avatar', avatarFile);
      }

      logger.info("Submitting profile update with FormData...");

      const res = await fetch('/api/user/update', {
        method: 'POST',
        // The browser will automatically set the 'Content-Type' header for FormData
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || t('unknownError'));
      }

      const updatedUserMeta = result.user.userMeta;
      await updateSession({ user: { userMeta: updatedUserMeta } });

      toast.success(t('updateSuccess'));
      setAvatarPreview(null);
      // Reset the file input to allow re-uploading the same file if needed
      if (avatarFileRef.current) {
        avatarFileRef.current.value = "";
      }
      form.reset(values);

    } catch (error) {
      toast.error(error.message || t('updateError'));
    }
  };
  
  const name = getMetaValue(userMeta, "name");
  const avatarUrl = getMetaValue(userMeta, "avatar");
  const { isSubmitting } = form.formState;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('title')}</h3>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <Label>{t('avatarLabel')}</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || avatarUrl || ""} alt="User avatar" className="object-cover" />
                <AvatarFallback>{name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <input type="file" accept="image/jpeg,image/png,image/webp" ref={avatarFileRef} onChange={handleAvatarChange} className="hidden" />
              <Button type="button" variant="outline" onClick={() => avatarFileRef.current?.click()} disabled={isSubmitting}>{t('changeAvatarButton')}</Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <Label>{t('usernameLabel')}</Label>
                <FormControl>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-background text-sm text-muted-foreground">
                      {hostname}/u/
                    </span>
                    <Input 
                      className="flex-1 min-w-0 block rounded-none rounded-r-md focus-visible:ring-0 focus-visible:ring-offset-0" 
                      placeholder={t('usernamePlaceholder')} 
                      {...field} 
                      disabled={isSubmitting || hasChangedUsername} 
                    />
                  </div>
                </FormControl>
                {hasChangedUsername ? (
                  <p className="text-sm text-muted-foreground mt-2">{t('usernameChangeWarning')}</p>
                ) : (
                  <FormMessage className="mt-2" />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>{t('displayNameLabel')}</Label>
                <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                <p className="text-sm text-muted-foreground">{t('displayNameDescription')}</p>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <Label>{t('bioLabel')}</Label>
                <FormControl><Textarea placeholder={t('bioPlaceholder')} {...field} disabled={isSubmitting} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('savingButton') : t('saveButton')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
