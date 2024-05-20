import routify from '@roxi/routify/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), routify({})]
});
