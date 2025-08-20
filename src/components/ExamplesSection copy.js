'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const examples = [
  {
    value: "marketing",
    labelKey: "marketingLabel",
    before: "Write a marketing email",
    after: "**Role:** Expert Email Marketer\n**Task:** Craft a compelling marketing email for a new productivity app, \"FlowState\".\n**Target Audience:** Freelancers and small business owners.\n**Key Message:** Highlight how FlowState helps reduce distractions and consolidate tasks.\n**Call to Action:** Offer a 14-day free trial, no credit card required.\n**Tone:** Energetic, inspiring, and benefit-driven."
  },
  {
    value: "job_seeking",
    labelKey: "jobSeekingLabel",
    before: "Help my resume",
    after: "**Role:** Professional Resume Writer & Career Coach\n**Task:** Review the following resume summary and suggest 3 improvements to make it more impactful for a Senior Software Engineer role.\n**Context:** I have 8 years of experience in full-stack development with a focus on React and Node.js.\n**Resume Summary:** \"Experienced software developer looking for new opportunities.\"\n**Output Format:** A list of 3 bullet points with revised summary options."
  },
  {
    value: "content_creation",
    labelKey: "contentCreationLabel",
    before: "ideas for a blog post",
    after: "**Role:** SEO & Content Strategist\n**Task:** Generate 5 engaging blog post titles about the future of remote work.\n**Constraint:** The titles must be SEO-friendly and appeal to an audience of tech leaders and HR professionals.\n**Keywords to include:** \"hybrid work\", \"company culture\", \"AI in workplace\".\n**Format:** A numbered list."
  }
];

export const ExamplesSection = () => {
  const t = useTranslations('ExamplesSection');

  return (
    <section id="difference" className="py-20 sm:py-32 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Tabs defaultValue="marketing" className="mt-12">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 max-w-md mx-auto">
            {examples.map((ex) => (
              <TabsTrigger key={ex.value} value={ex.value}>{t(ex.labelKey)}</TabsTrigger>
            ))}
          </TabsList>
          {examples.map((ex) => (
            <TabsContent key={ex.value} value={ex.value} className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('beforeTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-100 p-4 rounded-md">{ex.before}</pre>
                  </CardContent>
                </Card>
                <Card className="border-primary border-2">
                  <CardHeader>
                    <CardTitle>{t('afterTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-100 p-4 rounded-md">{ex.after}</pre>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
