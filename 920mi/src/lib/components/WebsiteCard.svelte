<script>
	export let website;
</script>

<div class="group relative block overflow-hidden rounded-lg border border-gray-200">
	<a href="/site/{website.id}">
		<img
			src={website.thumbnailUrl}
			alt={website.title}
			class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
		/>
		<div class="p-4">
			<h3 class="text-lg font-bold">{website.title}</h3>
			<p class="mt-1 text-sm text-gray-500">{website.description}</p>
			<div class="mt-4 flex flex-wrap gap-2">
				{#each website.tags as tag}
					<span class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
						{tag}
					</span>
				{/each}
			</div>
		</div>
	</a>
</div>
