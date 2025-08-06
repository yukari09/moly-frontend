import { websites } from '$lib/data.js';

export function load({ params }) {
	const website = websites.find((w) => w.id === params.id);
	const relatedTemplates = websites.filter((w) => w.id !== params.id).slice(0, 4);

	return {
		website,
		relatedTemplates
	};
}