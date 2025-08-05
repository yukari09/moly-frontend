<script>
	import '../app.css';
</script>

<div class="min-h-screen bg-white text-gray-900">
	<header class="border-b border-gray-200">
		<nav class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<a href="/" class="text-xl font-bold">
						<span>Directory</span>
					</a>
				</div>
				<div class="hidden sm:flex sm:items-center sm:space-x-8">
					<a href="/templates" class="text-sm font-medium text-gray-500 hover:text-gray-900">Templates</a>
					<a href="/docs" class="text-sm font-medium text-gray-500 hover:text-gray-900">Docs</a>
					<a href="/resources" class="text-sm font-medium text-gray-500 hover:text-gray-900">Resources</a>
				</div>
				<div class="flex items-center">
					<button class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
						All-Access Pass
					</button>
				</div>
			</div>
		</nav>
	</header>

	<main>
		<slot />
	</main>

	<footer class="border-t border-gray-200">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
				<div>
					<h3 class="text-sm font-semibold text-gray-900">Products</h3>
					<ul class="mt-4 space-y-2">
						<li><a href="#" class="text-sm text-gray-500 hover:text-gray-900">Lineicons</a></li>
						<li><a href="#" class="text-sm text-gray-500 hover:text-gray-900">TailAdmin</a></li>
						<li><a href="#" class="text-sm text-gray-500 hover:text-gray-900">GrayGrids</a></li>
					</ul>
				</div>
				<div>
					<h3 class="text-sm font-semibold text-gray-900">Useful Links</h3>
					<ul class="mt-4 space-y-2">
						<li><a href="#" class="text-sm text-gray-500 hover:text-gray-900">Next.js Website</a></li>
						<li><a href="#" class="text-sm text-gray-500 hover:text-gray-900">Next.js Boilerplate</a></li>
						<li><a href="#" class="text-sm text-gray-500 hover:text-gray-900">Next.js Templates</a></li>
					</ul>
				</div>
				<div>
					<h3 class="text-sm font-semibold text-gray-900">Terms and Policies</h3>
					<ul class="mt-4 space-y-2">
						<li><a href="#" class="text-sm text-gray-500 hover:text-gray-900">License</a></li>
						<li><a href="#" class="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a></li>
						<li><a href="#" class="text-sm text-gray-500 hover:text-gray-900">Refund Policy</a></li>
					</ul>
				</div>
				<div>
					<h3 class="text-sm font-semibold text-gray-900">Support & Help</h3>
					<ul class="mt-4 space-y-2">
						<li><a href="#" class="text-sm text-gray-500 hover:text-gray-900">Support Ticket</a></li>
						<li><a href="#" class="text-sm text-gray-500 hover:text-gray-900">Docs</a></li>
						<li><a href="#" class="text-sm text-gray-500 hover:text-gray-900">FAQs</a></li>
					</ul>
				</div>
			</div>
			<div class="mt-8 border-t border-gray-200 pt-8 text-center">
				<p class="text-sm text-gray-500">&copy; 2025 Your Company, Inc. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>