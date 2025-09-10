"use client"

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function PostItem({post}){
    return (
        <article class="flex flex-col gap-4">
            <Image src="/14.jpg" width="640" height="360" className="aspect-[2/1] rounded-sm" />
            <div className="space-y-2">
                <div className="text-sm text-muted-foreground  font-medium">Oct 21, 2024</div>
                <h3 className="text-primary leading-tighter text-lg font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-xl xl:tracking-tighter">What's the Best Way to Discipline My Child?</h3>
                <p className="line-clamp-2 text-muted-foreground">
                I know we're all here chasing the dream: building something that makes money while we sleep. The internet is flooded with gurus selling courses on how to achieve financial freedom with "surefire" passive income streams. But I want to throw a bit of a curveball today. Let's not talk about what's going to work. Let's talk about what's going to die.
                </p>
                <Badge variant="secondary">Ai Content</Badge>
            </div>
        </article>
    )
}