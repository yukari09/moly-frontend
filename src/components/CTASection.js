'use client';

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  const t = useTranslations('CTASection');

  return (
    <section id="cta" className="py-20 sm:py-32">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">{t('subtitle')}</p>
          <Button variant="secondary" size="lg" className="mt-8">
            {t('buttonText')}
          </Button>
        </div>
      </div>
    </section>
  );
};
