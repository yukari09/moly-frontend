'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const examples = [
  {
    value: "image_generation",
    labelKey: "imageGeneration",
    beforeKey: "imageGenerationBeforeContent",
    afterKey: "imageGenerationAfterContent",
    annotationKey: "imageGenerationAnnotation"
  },
  {
    value: "text_writing",
    labelKey: "textWriting",
    beforeKey: "textWritingBeforeContent",
    afterKey: "textWritingAfterContent",
    annotationKey: "textWritingAnnotation"
  },
  {
    value: "video_generation",
    labelKey: "videoGeneration",
    beforeKey: "videoGenerationBeforeContent",
    afterKey: "videoGenerationAfterContent",
    annotationKey: "videoGenerationAnnotation"
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
        <Tabs defaultValue="image_generation" className="mt-12">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex justify-center">
              <TabsList>
                {examples.map((ex) => (
                  <TabsTrigger key={ex.value} value={ex.value}>{t(ex.labelKey)}</TabsTrigger>
                ))}
              </TabsList>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {examples.map((ex) => (
            <TabsContent key={ex.value} value={ex.value} className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('beforeTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm font-mono  p-4 rounded-md">{t(ex.beforeKey)}</pre>
                  </CardContent>
                </Card>
                <Card className="border-primary border-2">
                  <CardHeader>
                    <CardTitle>{t('afterTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm font-mono  p-4 rounded-md">{t(ex.afterKey)}</pre>
                    <p className="text-sm text-muted-foreground mt-2">{t(ex.annotationKey)}</p>
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
