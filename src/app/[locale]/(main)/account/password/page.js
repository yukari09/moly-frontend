"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PasswordPage() {
  const t = useTranslations('UserPassword');
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setLinkSent(false);

    try {
      const res = await fetch('/api/user/request-password-reset', {
        method: 'POST',
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || t('unknownError'));

      toast.success(t('resetLinkSent'));
      setLinkSent(true);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('title')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <Separator />
      {linkSent ? (
        <Alert variant="default">
          <Terminal className="h-4 w-4" />
          <AlertTitle>{t('checkInboxTitle')}</AlertTitle>
          <AlertDescription>
            {t.rich('checkInboxDescription', {
              email: session?.user?.email,
              strong: (chunks) => <strong>{chunks}</strong>
            })}
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>{t('verifiedEmailLabel')}</Label>
            <p className="text-sm font-medium text-muted-foreground">{session?.user?.email}</p>
          </div>
          <Button type="submit" disabled={isSubmitting} className="mt-4">
            {isSubmitting ? t('sendingButton') : t('sendButton')}
          </Button>
        </form>
      )}
    </div>
  );
}
