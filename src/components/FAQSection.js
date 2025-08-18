'use client';

import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    value: "item-1",
    questionKey: "q1",
    answerKey: "a1",
  },
  {
    value: "item-2",
    questionKey: "q2",
    answerKey: "a2",
  },
  {
    value: "item-3",
    questionKey: "q3",
    answerKey: "a3",
  },
  {
    value: "item-4",
    questionKey: "q4",
    answerKey: "a4",
  },
];

export const FAQSection = () => {
  const t = useTranslations('FAQSection');

  return (
    <section id="faq" className="py-20 sm:py-32">
      <div className="max-w-screen-md mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Accordion type="single" collapsible className="w-full mt-12">
          {faqs.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value}>
              <AccordionTrigger className="text-lg text-left">{t(faq.questionKey)}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {t(faq.answerKey)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
