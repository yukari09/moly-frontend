import Link from "next/link";
import { ExternalLink, Triangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export const TemplateCard = ({ name, slug, description, author, imageSrc }) => (
  <Link href={`/site/${slug}`} className="block">
    <Card className="overflow-hidden flex flex-col border-gray-200 rounded-lg h-full hover:border-gray-300 transition-colors">
      <CardHeader className="p-0">
        <div className="w-full aspect-[1.9/1] bg-gray-50 overflow-hidden">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        <h3 className="font-semibold text-base text-black">{name}</h3>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-5 pt-0 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Triangle className="w-4 h-4 fill-current" />
          <span>by {author}</span>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-500" />
      </CardFooter>
    </Card>
  </Link>
);
