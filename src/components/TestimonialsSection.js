'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quoteKey: "quote1",
    name: "Sarah L.",
    titleKey: "title1",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quoteKey: "quote2",
    name: "Mark C.",
    titleKey: "title2",
    avatar: "https://randomuser.me/api/portraits/men/43.jpg",
  },
  {
    quoteKey: "quote3",
    name: "Jessica P.",
    titleKey: "title3",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
];

export const TestimonialsSection = () => {
  const t = useTranslations('TestimonialsSection');

  return (
    <section id="testimonials" className="py-20 sm:py-32 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col justify-between">
              <CardContent className="pt-6">
                <p className="text-lg">“{t(testimonial.quoteKey)}”</p>
              </CardContent>
              <div className="flex items-center p-6 pt-0">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{t(testimonial.titleKey)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
