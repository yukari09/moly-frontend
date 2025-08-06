<script lang="ts">
	import WebsiteCard from '$lib/components/WebsiteCard.svelte';
	import CallToAction from '$lib/components/CallToAction.svelte';
	import * as Button from '$lib/components/ui/button';
	import * as Separator from '$lib/components/ui/separator';
	import { ArrowUpRight } from 'lucide-svelte';

	export let data;
	const { website, relatedTemplates } = data;

	const galleryImages = [
		'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
		'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
		'https://images.unsplash.com/photo-1488372759429-16d13697de11?w=800&q=80',
		'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
		'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
		'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
	];
</script>

<svelte:head>
	<title>{website.title}</title>
	<meta name="description" content={website.description} />
</svelte:head>

<div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
	<div class="py-8">
		<a href="/" class="text-sm text-muted-foreground hover:text-foreground">
			← Back to Templates
		</a>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-x-12">
		<div class="flex flex-col">
			<h1 class="text-5xl font-bold tracking-tighter leading-tight">
				{website.title}
			</h1>
			<p class="mt-4 text-muted-foreground">{website.description}</p>

			<div class="mt-8 flex items-center space-x-4">
				<Button.Root size="lg">Deploy</Button.Root>
				<Button.Root size="lg" variant="outline">View Demo</Button.Root>
			</div>

			<Separator.Root class="my-8" />

			<div class="space-y-4 text-sm">
				<div class="flex justify-between">
					<span class="text-muted-foreground">Repository</span>
					<a href="#" class="font-medium hover:underline flex items-center gap-1">
						vercel/next.js <ArrowUpRight class="h-4 w-4" />
					</a>
				</div>
				<Separator.Root />
				<div class="flex justify-between">
					<span class="text-muted-foreground">Framework</span>
					<span class="font-medium">Next.js</span>
				</div>
				<Separator.Root />
				<div class="flex justify-between">
					<span class="text-muted-foreground">Use Case</span>
					<span class="font-medium">Starter</span>
				</div>
				<Separator.Root />
				<div class="flex justify-between">
					<span class="text-muted-foreground">CSS</span>
					<span class="font-medium">Tailwind</span>
				</div>
			</div>
		</div>

		<div class="mt-12 md:mt-0">
			<div class="rounded-lg overflow-hidden border">
				<img src={galleryImages[0]} alt="Gallery" class="w-full h-auto" />
			</div>
		</div>
	</div>

	<div class="py-24">
		<h2 class="text-2xl font-semibold tracking-tight">Related Templates</h2>
		<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each relatedTemplates as template}
				<WebsiteCard {website} />
			{/each}
		</div>
	</div>
</div>

<CallToAction />
