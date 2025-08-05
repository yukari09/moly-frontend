<script>
	import { websites } from '$lib/data.js';
	import { error } from '@sveltejs/kit';

	export let data;

	const website = websites.find((w) => w.id === data.id);

	if (!website) {
		throw error(404, 'Website not found');
	}
</script>

<svelte:head>
	<title>{website.title}</title>
	<meta name="description" content={website.description} />
</svelte:head>

<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
		<div>
			<h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
				{website.title}
			</h1>
			<p class="mt-4 text-xl text-gray-500">{website.description}</p>
			<div class="mt-6">
				<a
					href={website.websiteUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
				>
					Visit Website
				</a>
			</div>
			<div class="mt-8">
				<h2 class="text-sm font-medium text-gray-500">Tags</h2>
				<div class="mt-2 flex flex-wrap gap-2">
					{#each website.tags as tag}
						<span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
							{tag}
						</span>
					{/each}
				</div>
			</div>
		</div>

		<div class="mt-10 lg:mt-0">
			<img
				src={website.thumbnailUrl}
				alt={website.title}
				class="rounded-lg shadow-lg w-full h-auto object-cover"
			/>
		</div>
	</div>
</div>
