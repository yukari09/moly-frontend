<script>
	import { websites } from '$lib/data.js';
	import WebsiteCard from '$lib/components/WebsiteCard.svelte';
</script>

<svelte:head>
	<title>Website Directory</title>
	<meta name="description" content="A directory of useful websites." />
</svelte:head>

<section class="py-12 md:py-20">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
				20+ Best Free and Premium Next.js Templates for Your Next Projects
			</h1>
			<p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
				Discover a wide range of high-quality Next.js templates for your web projects.
			</p>
		</div>

		<div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each websites as website}
				<WebsiteCard {website} />
			{/each}
		</div>
	</div>
</section>