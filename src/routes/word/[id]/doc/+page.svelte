<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Card,
		Button,
		P,
		Heading,
		Span,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { page } from '$app/stores';
	import type { Item } from '$lib/utils/types/word';
	import type { PageData } from './$types';
	import { rewriteHTML } from '$lib/utils/middlewares/rewrite-html';

	export let data: PageData;

	let id: string;
	let contentData: { title?: any; content?: any };
	let itemsInItem: Item[] = [];

	onMount(async () => {
		const { params } = await $page;
		id = params.id;

		const filteredItems = data.docs.contents.filter((item) => item.tag.includes(id));

		if (filteredItems.length > 0) {
			contentData = filteredItems[0];
		} else {
			itemsInItem = [];
		}
	});
</script>

<Button class="w-fit mb-4" on:click={() => (location.href = `/word/${id}`)}>Back to List</Button>
{#if contentData}
	<Heading tag="h1" class="mb-4"
		><Span underline decorationClass="decoration-8">{contentData.title}</Span></Heading
	>
	<div class="m-4 pt-4">
		{@html rewriteHTML(contentData.content)}
	</div>
{:else}
	<p>loading...</p>
{/if}
