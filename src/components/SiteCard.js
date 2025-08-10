import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const SiteCard = ({ name, slug, description, author, imageSrc, authorImage, tags }) => (
  <Link href={`/site/${slug}`} className="block group">
    <Card className="overflow-hidden flex flex-col border-gray-200 rounded-lg h-full group-hover:border-gray-300 transition-colors duration-200 py-0">
      <CardHeader className="p-0">
        <div className="w-full aspect-[1.9/1] bg-gray-50 overflow-hidden">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        <h3 className="font-semibold text-base text-black">{name}</h3>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-2">{description}</p>
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-normal text-gray-600">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between p-5 pt-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Avatar className="w-6 h-6">
            <AvatarImage src={authorImage} alt={author} />
            <AvatarFallback>{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{author}</span>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </CardFooter>
    </Card>
  </Link>
);