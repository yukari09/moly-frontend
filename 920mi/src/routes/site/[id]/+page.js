import { error } from '@sveltejs/kit';

export function load({ params }) {
	// In a real app, you'd fetch this data from an API
	// based on the params.id
	return {
		id: params.id
	};
}
