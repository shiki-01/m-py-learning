<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, Button, P, Gallery } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import type { Item } from '$lib/utils/types/word';
	import type { PageData } from './$types';

	export let data: PageData;

	let flipped: { [key: string]: boolean } = {};
	let id: string;
	let contentData;
	let itemsInItem: Item[] = [];

	onMount(async () => {
		const { params } = await $page;
		id = params.id;

		// 'contents'キーの下にある配列を取得し、'sectionid'タグを持つアイテムだけをフィルタリング
		itemsInItem = data.words.contents.filter((item) => item.tag.includes(id)).reverse();
		itemsInItem.forEach((item) => (flipped[item.title] = false));

		// 'doc'キーの下にあるオブジェクトを取得
		contentData = data;
	});

	function flip(itemName: string) {
		flipped[itemName] = !flipped[itemName];
	}
</script>

<div class="mb-4 flex justify-center gap-4">
	<Button class="w-fit" on:click={() => (location.href = `/word/${id}/test`)}>Start Test !</Button>
	<Button class="w-fit" on:click={() => (location.href = `/word/${id}/doc`)}>Learn more !</Button>
</div>
<Gallery class="mt-4 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each itemsInItem as item}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="card relative flex h-auto min-h-[64px] justify-center"
			class:flipped={flipped[item.title]}
			on:click={() => flip(item.title)}
		>
			<div class="card-face card-front absolute inset-0 w-fit">
				<Card>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{item.title}
					</h5>
				</Card>
			</div>
			<div class="card-face card-back absolute w-fit">
				<Card>
					<div class="card-con">
						<P class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400"
							>{item.descriptionS}</P
						>
					</div>
				</Card>
			</div>
		</div>
	{/each}
</Gallery>

<style lang="scss">
	.card {
		transform-style: preserve-3d;
		transition: transform 0.6s;
		height: 120px;
		position: relative;
	}
	.card.flipped {
		transform: rotateY(180deg);
	}
	.card-face {
		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
	}
	.card-back {
		transform: rotateY(180deg);
	}
</style>
