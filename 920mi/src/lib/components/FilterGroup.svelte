<script>
	export let group;

	function toggle() {
		group.isOpen = !group.isOpen;
	}
</script>

<div>
	<button
		on:click={toggle}
		class="flex w-full items-center justify-between py-3 text-left text-sm font-medium"
	>
		<span>{group.name}</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="h-5 w-5 transform text-gray-400 transition-transform duration-200"
			class:rotate-180={!group.isOpen}
		>
			<path
				fill-rule="evenodd"
				d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>
	{#if group.isOpen}
		<div class="space-y-3 pt-2">
			{#each group.options as option}
				<label class="flex items-center justify-between text-sm">
					<span class="flex items-center">
						<input
							type="checkbox"
							bind:checked={option.checked}
							class="h-4 w-4 rounded border-gray-300 text-black shadow-sm focus:ring-black"
						/>
						<span class="ml-3 text-gray-600">{option.name}</span>
					</span>
					<span class="text-gray-500">{option.count}</span>
				</label>
			{/each}
		</div>
	{/if}
</div>

