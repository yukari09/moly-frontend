<script>
	const footerLinks = [
		{
			title: 'Products',
			links: [
				{ text: 'Pro', href: '#' },
				{ text: 'Enterprise', href: '#' },
				{ text: 'Pricing', href: '#' },
				{ text: 'Documentation', href: '#' }
			]
		},
		{
			title: 'Solutions',
			links: [
				{ text: 'Marketing', href: '#' },
				{ text: 'Analytics', href: '#' },
				{ text: 'Commerce', href: '#' },
				{ text: 'Insights', href: '#' }
			]
		},
		{
			title: 'Resources',
			links: [
				{ text: 'Guides', href: '#' },
				{ text: 'Blog', href: '#' },
				{ text: 'Customer Stories', href: '#' },
				{ text: 'Support', href: '#' }
			]
		},
		{
			title: 'Company',
			links: [
				{ text: 'About', href: '#' },
				{ text: 'Jobs', href: '#' },
				{ text: 'Press', href: '#' },
				{ text: 'Partners', href: '#' }
			]
		},
		{
			title: 'Legal',
			links: [
				{ text: 'Claim', href: '#' },
				{ text: 'Privacy', href: '#' },
				{ text: 'Terms', href: '#' }
			]
		}
	];
</script>

<footer class="bg-white border-t border-gray-200">
	<div class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
		<div class="grid grid-cols-2 md:grid-cols-6 gap-8">
			<div class="col-span-2 md:col-span-1">
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
			</div>

			{#each footerLinks as section}
				<div class="text-sm">
					<h3 class="font-semibold text-gray-900">{section.title}</h3>
					<ul class="mt-4 space-y-3">
						{#each section.links as link}
							<li>
								<a href={link.href} class="text-gray-500 hover:text-gray-900">{link.text}</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
			<p class="text-sm text-gray-500">&copy; {new Date().getFullYear()} Vercel Inc.</p>
			<div class="flex items-center space-x-4">
				<a href="#" class="text-gray-500 hover:text-gray-900">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M12 2C6.477 2 2 6.477 2 12.013c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.577.688.482A10.001 10.001 0 0022 12.013C22 6.477 17.523 2 12 2z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>
				<a href="#" class="text-gray-500 hover:text-gray-900">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</footer>
