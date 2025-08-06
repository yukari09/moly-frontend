<script>
	import WebsiteCard from '$lib/components/WebsiteCard.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { websites as allWebsites } from '$lib/data.js';

	let searchTerm = '';
	let filterGroups = [
		{
			name: 'Use Case',
			isOpen: true,
			options: [
				{ name: 'AI', count: 2, checked: false },
				{ name: 'Starter', count: 2, checked: false },
				{ name: 'E-commerce', count: 1, checked: false },
				{ name: 'SaaS', count: 1, checked: false },
				{ name: 'Portfolio', count: 1, checked: false },
				{ name: 'Marketplace', count: 1, checked: false },
				{ name: 'Blog', count: 1, checked: false },
				{ name: 'Documentation', count: 1, checked: false }
			]
		},
		{
			name: 'Framework',
			isOpen: true,
			options: [{ name: 'Next.js', count: 9, checked: true }]
		},
		{
			name: 'CSS',
			isOpen: true,
			options: [
				{ name: 'Tailwind CSS', count: 0, checked: false },
				{ name: 'Sanity', count: 0, checked: false }
			]
		}
	];

	$: filteredWebsites = allWebsites.filter((website) => {
		const lowerSearchTerm = searchTerm.toLowerCase();
		const matchesSearch =
			!searchTerm ||
			website.title.toLowerCase().includes(lowerSearchTerm) ||
			website.description.toLowerCase().includes(lowerSearchTerm);

		const selectedFilters = filterGroups
			.flatMap((g) => g.options)
			.filter((o) => o.checked)
			.map((o) => o.name);

		if (selectedFilters.length === 0) {
			return matchesSearch;
		}

		const matchesFilters = selectedFilters.every((filter) => website.tags.includes(filter));

		return matchesSearch && matchesFilters;
	});
</script>

<svelte:head>
	<title>Next.js Starter Templates and Themes</title>
	<meta
		name="description"
		content="Discover Next.js templates, starters, and themes to jumpstart your application or website build."
	/>
</svelte:head>

<div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pb-12">
	<div class="py-16 text-center">
		<h1 class="text-5xl md:text-6xl font-bold tracking-tighter text-black leading-tight">
			Next.js starter templates <br /> and themes
		</h1>
		<p class="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
			Discover Next.js templates, starters, and themes to jumpstart your application or website
			build.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-x-8 md:grid-cols-4">
		<aside class="md:col-span-1">
			<div class="sticky top-20">
				<Sidebar bind:filterGroups bind:searchTerm />
			</div>
		</aside>

		<main class="md:col-span-3">
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredWebsites as website (website.id)}
					<WebsiteCard {website} />
				{/each}
			</div>
		</main>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Inter', sans-serif;
	}
</style>
