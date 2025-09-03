import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ArticleCard({ post }) {
  return (
    <Link href={`/stories/${post.slug}`}>
      <Card className="flex flex-col overflow-hidden h-full hover:bg-accent transition-colors">
        <div className="relative w-full h-48">
          <Image 
            src={post.imageUrl} 
            alt={post.title} 
            layout="fill" 
            objectFit="cover" 
            unoptimized={true} 
          />
        </div>
        <CardHeader>
          <CardTitle className="text-lg font-serif">{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
          <div className="text-xs text-muted-foreground">By {post.author}</div>
        </CardContent>
      </Card>
    </Link>
  );
}
