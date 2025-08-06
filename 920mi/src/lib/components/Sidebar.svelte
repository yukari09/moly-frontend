<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Button from '$lib/components/ui/button';
	import * as Input from '$lib/components/ui/input';
	import * as Checkbox from '$lib/components/ui/checkbox';
	import * as Label from '$lib/components/ui/label';
	import { Search } from 'lucide-svelte';

	export let searchTerm = '';
	export let filterGroups: {
		name: string;
		isOpen: boolean;
		options: { name: string; count: number; checked: boolean }[];
	}[] = [];

	function clearFilters() {
		searchTerm = '';
		filterGroups = filterGroups.map((group) => ({
			...group,
			options: group.options.map((opt) => ({
				...opt,
				checked: false
			}))
		}));
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h3 class="text-sm font-medium">Filter Templates</h3>
		<Button.Root variant="link" class="p-0 h-auto" on:click={clearFilters}>Clear</Button.Root>
	</div>

	<div class="relative">
		<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
		<Input.Root bind:value={searchTerm} placeholder="Search..." class="pl-10" />
	</div>

	<Accordion.Root multiple class="w-full">
		{#each filterGroups as group, i}
			<Accordion.Item value={`item-${i}`}>
				<Accordion.Trigger>{group.name}</Accordion.Trigger>
				<Accordion.Content>
					<div class="space-y-3 pt-2">
						{#each group.options as option, j}
							<div class="flex items-center justify-between">
								<Label.Root
									for={`checkbox-${i}-${j}`}
									class="flex items-center space-x-3 font-normal"
								>
									<Checkbox.Root bind:checked={option.checked} id={`checkbox-${i}-${j}`} />
									<span class="text-sm text-muted-foreground">{option.name}</span>
								</Label.Root>
								<span class="text-sm text-muted-foreground">{option.count}</span>
							</div>
						{/each}
					</div>
				</Accordion.Content>
			</Accordion.Item>
		{/each}
	</Accordion.Root>
</div>