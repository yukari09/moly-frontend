<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Button from '$lib/components/ui/button';
	import { ArrowUpRight } from 'lucide-svelte';

	export let website: {
		id: string;
		title: string;
		description: string;
		thumbnailUrl: string;
		websiteUrl: string;
		author: string;
		tags: string[];
	};
</script>

<Card.Root class="overflow-hidden transition-all duration-300 hover:shadow-md">
	<a href={`/site/${website.id}`} class="block cursor-pointer group">
		<div class="relative aspect-[1.91/1] w-full overflow-hidden bg-muted">
			<img
				src={website.thumbnailUrl}
				alt={website.title}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
			<div class="absolute top-3 left-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-md"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						class="h-5 w-5 text-foreground"
						fill="currentColor"
					>
						<path d="M12 0L24 21H0L12 0Z" />
					</svg>
				</div>
			</div>
		</div>
	</a>
	<Card.Header>
		<Card.Title>{website.title}</Card.Title>
		<Card.Description class="truncate">{website.description}</Card.Description>
	</Card.Header>
	<Card.Footer class="flex justify-between items-center">
		<div class="flex items-center space-x-2 text-sm text-muted-foreground">
			<svg
				aria-label="Vercel Logo"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				class="h-4 w-4"
				fill="currentColor"
			>
				<path d="M12 0L24 21H0L12 0Z" />
			</svg>
			<span>by {website.author || 'Vercel'}</span>
		</div>
		<a href={website.websiteUrl} target="_blank" rel="noopener noreferrer">
			<Button.Root variant="ghost" size="icon">
				<ArrowUpRight class="h-4 w-4" />
			</Button.Root>
		</a>
	</Card.Footer>
</Card.Root>