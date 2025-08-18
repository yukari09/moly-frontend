'use client';

import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Puzzle, Activity, WandSparkles, Rocket } from 'lucide-react';

const features = [
  {
    icon: <Puzzle className="w-10 h-10 text-primary" />,
    titleKey: "deconstructTitle",
    descriptionKey: "deconstructDescription",
  },
  {
    icon: <Activity className="w-10 h-10 text-primary" />,
    titleKey: "diagnoseTitle",
    descriptionKey: "diagnoseDescription",
  },
  {
    icon: <WandSparkles className="w-10 h-10 text-primary" />,
    titleKey: "developTitle",
    descriptionKey: "developDescription",
  },
  {
    icon: <Rocket className="w-10 h-10 text-primary" />,
    titleKey: "deliverTitle",
    descriptionKey: "deliverDescription",
  },
];

export const FeaturesSection = () => {
  const t = useTranslations('FeaturesSection');

  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card key={feature.titleKey} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="items-center">
                {feature.icon}
                <CardTitle className="mt-4">{t(feature.titleKey)}</CardTitle>
              </CardHeader>
              <CardDescription className="px-6 pb-6">
                {t(feature.descriptionKey)}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
