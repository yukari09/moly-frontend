"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getMetaValue } from "@/lib/utils";
import logger from "@/lib/logger";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

// Helper function to validate URLs
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to create URL validation with domain checking
const createSocialUrlField = (domains, errorKey, t) => 
  z.string()
    .optional()
    .transform(val => val?.trim() || '') // Normalize empty/whitespace values
    .refine(
      val => !val || isValidUrl(val),
      { message: t('invalidUrl') }
    )
    .refine(
      val => !val || domains.some(domain => val.includes(domain)),
      { message: t(errorKey) }
    );

const createSocialLinksSchema = (t) => z.object({
  website: z.string()
    .optional()
    .transform(val => val?.trim() || '')
    .refine(
      val => !val || isValidUrl(val),
      { message: t('invalidUrl') }
    ),
    
  x: createSocialUrlField(
    ['x.com', 'twitter.com'], 
    'invalidXUrl', 
    t
  ),
  
  github: createSocialUrlField(
    ['github.com'], 
    'invalidGithubUrl', 
    t
  ),
  
  linkedin: createSocialUrlField(
    ['linkedin.com'], 
    'invalidLinkedinUrl', 
    t
  ),
  
  facebook: createSocialUrlField(
    ['facebook.com'], 
    'invalidFacebookUrl', 
    t
  ),
});
 

export default function SocialLinksPage() {
  const t = useTranslations('UserSocialLinks');
  const { data: session, update: updateSession } = useSession();

  // @ts-ignore
  const userMeta = session?.user?.userMeta;

  const form = useForm({
    resolver: zodResolver(createSocialLinksSchema(t)),
    defaultValues: {
      website: getMetaValue(userMeta, "website") || "",
      x: getMetaValue(userMeta, "x") || "",
      github: getMetaValue(userMeta, "github") || "",
      linkedin: getMetaValue(userMeta, "linkedin") || "",
      facebook: getMetaValue(userMeta, "facebook") || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      const userMetaPayload = Object.entries(values).map(([key, value]) => ({ metaKey: key, metaValue: value }));

      logger.info("Submitting social links update:", userMetaPayload);

      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMetaPayload),
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || t('unknownError'));

      const updatedUserMeta = result.user.userMeta;
      await updateSession({ user: { userMeta: updatedUserMeta } });

      toast.success(t('updateSuccess'));
      form.reset(values);

    } catch (error) {
      toast.error(error.message || t('updateError'));
    }
  };
  
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
          <FormField control={form.control} name="website" render={({ field }) => (<FormItem><Label>{t('websiteLabel')}</Label><FormControl><Input placeholder={t('websitePlaceholder')} {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="x" render={({ field }) => (<FormItem><Label>{t('xLabel')}</Label><FormControl><Input placeholder={t('xPlaceholder')} {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="github" render={({ field }) => (<FormItem><Label>{t('githubLabel')}</Label><FormControl><Input placeholder={t('githubPlaceholder')} {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="linkedin" render={({ field }) => (<FormItem><Label>{t('linkedinLabel')}</Label><FormControl><Input placeholder={t('linkedinPlaceholder')} {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="facebook" render={({ field }) => (<FormItem><Label>{t('facebookLabel')}</Label><FormControl><Input placeholder={t('facebookPlaceholder')} {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
          
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