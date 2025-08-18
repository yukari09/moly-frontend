"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  MessageSquare,
  Image,
  Video,
  Palette,
  Brain,
  Code,
} from "lucide-react";

const applicablePlatforms = [
  {
    icon: <Palette className="w-8 h-8 text-primary" />,
    titleKey: "midjourneyOptimizerTitle",
    descriptionKey: "midjourneyOptimizerDescription",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-primary" />,
    titleKey: "chatgptOptimizerTitle",
    descriptionKey: "chatgptOptimizerDescription",
  },
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    titleKey: "geminiOptimizerTitle",
    descriptionKey: "geminiOptimizerDescription",
  },
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    titleKey: "claudeOptimizerTitle",
    descriptionKey: "claudeOptimizerDescription",
  },
  {
    icon: <Image className="w-8 h-8 text-primary" />,
    titleKey: "imageOptimizerTitle",
    descriptionKey: "imageOptimizerDescription",
  },
  {
    icon: <Video className="w-8 h-8 text-primary" />,
    titleKey: "videoOptimizerTitle",
    descriptionKey: "videoOptimizerDescription",
  },
];

export const ApplicablePlatformsSection = () => {
  const t = useTranslations("ApplicablePlatformsSection");

  return (
    <section id="use-cases" className="py-20 sm:py-32 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applicablePlatforms.map((platform) => (
            <Card
              key={platform.titleKey}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardHeader className="items-center">
                {platform.icon}
                <CardTitle className="mt-4">{t(platform.titleKey)}</CardTitle>
              </CardHeader>
              <CardDescription className="px-6 pb-6">
                {t(platform.descriptionKey)}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
