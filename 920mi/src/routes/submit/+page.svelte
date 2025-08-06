<script>
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from "$lib/components/ui/select/index.js";
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let formEl;
	let selectedCategory;
</script>

<svelte:head>
	<title>Submit a Template</title>
	<meta name="description" content="Submit your template to the Vercel Template Marketplace." />
</svelte:head>

<div class="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8 py-12">
	<div class="text-center">
		<h1 class="text-4xl font-bold tracking-tighter">Submit a Template</h1>
		<p class="mt-4 text-lg text-muted-foreground">
			Share your work with the Vercel community. Submit your template to be featured in the
			Marketplace.
		</p>
	</div>

	<form
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					formEl?.reset();
					alert('Thank you for your submission! We will review it shortly.');
				}
			};
		}}
		class="mt-12 space-y-6"
		bind:this={formEl}
		enctype="multipart/form-data"
	>
		<div class="grid w-full items-center gap-1.5">
			<Label for="url">Website URL</Label>
			<Input type="url" name="url" id="url" required placeholder="https://example.com" />
		</div>

		<div class="grid w-full items-center gap-1.5">
			<Label for="email">Your Email</Label>
			<Input type="email" name="email" id="email" required placeholder="you@example.com" />
		</div>

		<div class="grid w-full items-center gap-1.5">
			<Label for="category">Category</Label>
			<Select.Root name="category" type="single" required bind:value={selectedCategory}>
				<Select.Trigger class="w-full">Select a category</Select.Trigger>
				<Select.Content>
					<Select.Item value="AI">AI</Select.Item>
					<Select.Item value="Starter">Starter</Select.Item>
					<Select.Item value="E-commerce">E-commerce</Select.Item>
					<Select.Item value="SaaS">SaaS</Select.Item>
					<Select.Item value="Portfolio">Portfolio</Select.Item>
					<Select.Item value="Marketplace">Marketplace</Select.Item>
					<Select.Item value="Blog">Blog</Select.Item>
					<Select.Item value="Documentation">Documentation</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>

		<div class="grid w-full items-center gap-1.5">
			<Label for="short-description">Short Description</Label>
			<Input
				type="text"
				name="short_description"
				id="short-description"
				required
				placeholder="A brief summary of your template."
			/>
		</div>

		<div class="grid w-full items-center gap-1.5">
			<Label for="description">Full Description</Label>
			<Textarea
				name="description"
				id="description"
				required
				placeholder="Describe your template in detail."
				class="min-h-[100px]"
			/>
		</div>

		<div class="grid w-full items-center gap-1.5">
			<Label for="tags">Tags (comma-separated)</Label>
			<Input
				type="text"
				name="tags"
				id="tags"
				placeholder="e.g., Next.js, Tailwind CSS, Sanity"
			/>
		</div>

		<div class="grid w-full items-center gap-1.5">
			<Label for="media">Media (Screenshots, Videos)</Label>
			<Input type="file" name="media" id="media" multiple accept="image/*,video/*" />
		</div>

		<div class="text-right">
			<Button type="submit">Submit</Button>
		</div>
	</form>
</div>
