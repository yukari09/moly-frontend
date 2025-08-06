<script>
	import '../app.css';
	import { page } from '$app/stores';
	import Footer from '$lib/components/Footer.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	const navLinks = [
		{ href: '#', text: 'Products' },
		{ href: '#', text: 'Solutions' },
		{ href: '/', text: 'Resources' },
		{ href: '#', text: 'Enterprise' },
		{ href: '#', text: 'Docs' },
		{ href: '#', text: 'Pricing' }
	];
</script>

<div class="min-h-screen bg-white font-sans text-black flex flex-col">
	<header class="border-b border-gray-200">
		<div class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center space-x-8">
					<a href="/" class="flex items-center space-x-2">
						<svg
							aria-label="Vercel Logo"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="h-6 w-6"
							fill="currentColor"
						>
							<path d="M12 0L24 21H0L12 0Z" />
						</svg>
					</a>
					<div class="h-8 border-l border-gray-200" />
					<nav class="hidden md:flex md:items-center md:space-x-6">
						{#each navLinks as link}
							<a
								href={link.href}
								class="text-sm {page.url?.pathname?.startsWith('/resources') &&
								link.text === 'Resources'
									? 'font-semibold text-black'
									: 'text-gray-500 hover:text-black'}"
							>
								{link.text}
							</a>
						{/each}
					</nav>
				</div>
				<div class="flex items-center space-x-4">
					{#if $page.data.session?.user}
						<span class="text-sm text-gray-600">{$page.data.session.user.name}</span>
						<form method="POST" action="/signout">
							<Button type="submit" variant="secondary" size="sm">Sign Out</Button>
						</form>
					{:else}
						<Button asChild size="sm">
							<a href="/signin">Login</a>
						</Button>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<main class="flex-grow">
		<slot />
	</main>

	<Footer />
</div>
