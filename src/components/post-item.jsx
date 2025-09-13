'use client'

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function PostItem({ post }) {
    // Placeholder image if no featured image is found in the data
    const imageUrl = post.featured_image || `/11.jpg`; 

    return (
        <Link href={`/article/${post.post_name}`} className="block">
            <article className="flex flex-col gap-4 group">
                <div className="overflow-hidden rounded-sm">
                    <Image 
                        src={imageUrl} 
                        alt={post.post_title} 
                        width={640} 
                        height={360} 
                        className="aspect-[2/1] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground font-medium">
                        <time dateTime={post.inserted_at}>
                            {new Date(post.inserted_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                    </div>
                    <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter group-hover:underline">
                        {post.post_title}
                    </h3>
                    <p className="line-clamp-2 text-muted-foreground">
                        {post.post_excerpt}
                    </p>
                    {post.category && post.category.length > 0 && (
                         <Badge variant="secondary">{post.category[0].name}</Badge>
                    )}
                </div>
            </article>
        </Link>
    )
}
