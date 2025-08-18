'use client';

import { useTranslations } from 'next-intl';
import { Keyboard, MousePointerClick, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: <Keyboard className="w-10 h-10 text-primary" />,
    titleKey: "step1Title",
    descriptionKey: "step1Description",
  },
  {
    icon: <MousePointerClick className="w-10 h-10 text-primary" />,
    titleKey: "step2Title",
    descriptionKey: "step2Description",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-primary" />,
    titleKey: "step3Title",
    descriptionKey: "step3Description",
  },
];

export const HowItWorksSection = () => {
  const t = useTranslations('HowItWorksSection');

  return (
    <section id="how-it-works" className="py-20 sm:py-32">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="relative mt-16">
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto bg-primary/10 rounded-full mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold">{t(step.titleKey)}</h3>
                <p className="mt-2 text-muted-foreground">{t(step.descriptionKey)}</p>
              </div>
            ))}
          </div>
          {/* Connecting lines for larger screens */}
          <div
            className="hidden md:block absolute top-10 left-0 w-full h-px -z-10"
            aria-hidden="true"
          >
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1045 2">
                <path
                    d="M1 1h1043"
                    stroke="#d1d5db"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="1 8"
                ></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
