'use client'

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Helper function to find the first image URL in Editor.js content
function getImageUrlFromContent(postContent) {
    if (!postContent || typeof postContent !== 'string') {
        return null;
    }
    try {
        const content = JSON.parse(postContent);
        const imageBlock = content.blocks.find(block => block.type === 'image');
        return imageBlock ? imageBlock.data.file.url : null;
    } catch (error) {
        // console.error("Failed to parse post content for image:", error);
        return null;
    }
}

function getExcerptFromContent(postContent) {
    if (!postContent || typeof postContent !== 'string') {
        return null;
    }
    try {
        const content = JSON.parse(postContent);
        const paragraphBlock = content.blocks.find(block => block.type === 'paragraph');
        return paragraphBlock ? paragraphBlock.data.text : null;
    } catch (error) {
        // console.error("Failed to parse post content for image:", error);
        return null;
    }
}

export function PostItem({ post, layout = 'vertical' }) {
    // 1. Get image URL from content, then fallback to a placeholder
    const imageUrl = getImageUrlFromContent(post.post_content) || `/post-cover.jpg`;
    const excerpt = post.post_excerpt || getExcerptFromContent(post.post_content);
    const isHorizontal = layout === 'horizontal';

    return (
        <Link href={`/article/${post.post_name}`} className="block group h-full">
            <article className={cn(
                "flex gap-4 group h-full",
                isHorizontal ? "flex-row" : "flex-col"
            )}>
                {/* Image Container */}
                <div className={cn(
                    "overflow-hidden rounded-sm",
                    isHorizontal ? "w-1/3" : "w-full"
                )}>
                    <Image 
                        src={imageUrl} 
                        alt={post.post_title} 
                        width={684} 
                        height={342} 
                        loading="lazy"
                        placeholder="empty"
                        className={cn(
                            "object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full",
                            isHorizontal ? "aspect-[1/1] xl:aspect-[5/3]" : "aspect-[2/1]"
                        )}
                    />
                </div>
                {/* Text Content Container */}
                <div className={cn(
                    "flex flex-col space-y-2",
                    isHorizontal ? "w-2/3" : "w-full"
                )}>
                    <div className="text-sm text-muted-foreground font-medium">
                        <time dateTime={post.inserted_at}>
                            {new Date(post.inserted_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                    </div>
                    <h3 className="text-primary line-clamp-3 leading-tighter text-lg font-semibold tracking-tight lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter group-hover:underline">
                        {post.post_title}
                    </h3>
                    <p className="hidden xl:line-clamp-2 text-muted-foreground">
                        {excerpt}
                    </p>
                    <div className="flex items-center gap-1">
                        {post.category && post.category.length > 0 && (
                            post.category.map((c,i) => {
                                return (
                                    <Badge key={`${i}`} variant="secondary">{c.name}</Badge>
                                )
                            })
                        )}
                    </div>
                </div>
            </article>
        </Link>
    )
}
