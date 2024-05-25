<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { Button, Heading, Span } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import type { Item } from '$lib/utils/types/word';
	import type { PageData } from './$types';
	import { rewriteHTML, injectComponents } from '$lib/utils/middlewares/rewrite-html';

	export let data: PageData;
	let id: string;
	let contentData: { title?: any; content?: any };
	let rewrite: string;

	onMount(async () => {
		const { params } = await $page;
		id = params.id;

		const filteredItems = data.docs.contents.filter((item) => item.tag.includes(id));

		if (filteredItems.length > 0) {
			contentData = filteredItems[0];
		} else {
			contentData = { title: 'Not Found', content: 'The requested page is not found.' };
		}

		rewrite = rewriteHTML(contentData.content);
	});

	afterUpdate(() => {
		injectComponents();
	});
</script>

<Button class="mb-4 w-fit" on:click={() => (location.href = `/word/${id}`)}>Back to List</Button>
{#if contentData}
	<Heading tag="h2" class="mb-4"
		><Span underline decorationClass="decoration-2">{contentData.title}</Span></Heading
	>
	<div class="article m-4 pt-4">
		{@html rewrite}
	</div>
{:else}
	<p>loading...</p>
{/if}

<style lang="scss">
	:global(.article p) {
		@apply mb-4 text-lg;
	}
	:global(.article table) {
		display: block;
		@apply mb-8 mt-4 w-full min-w-full table-auto overflow-x-auto;

		:global(th),
		:global(td) {
			@apply whitespace-nowrap text-left font-medium;
		}

		:global(th) {
			@apply bg-gray-100 px-5 py-3 text-xs uppercase text-gray-600 dark:bg-gray-700 dark:text-gray-400;

			:global(p) {
				@apply m-0 text-sm;
			}
		}

		:global(td) {
			@apply p-2 px-5 text-base text-gray-900 dark:bg-gray-800 dark:text-gray-100;

			:global(p) {
				@apply py-2 m-0 text-sm;
			}
		}

		:global(tr) {
			:global(td) {
				@apply border-b border-gray-200 dark:border-gray-700;
			}

			&:hover :global(td) {
				@apply bg-gray-100 dark:bg-gray-600;
			}
		}
	}

	:global(.article table tbody) {
		@apply overflow-x-auto;
	}
</style>
