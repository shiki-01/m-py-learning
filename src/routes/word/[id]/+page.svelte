<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, Button } from 'flowbite-svelte';
	import { page } from '$app/stores';

	interface Item {
		name: string;
		description: string;
		syntax: string;
	}

	interface Word {
		label: string;
		id: string;
		items: Item[];
	}

	let words: Word[] = [];
	let flipped: { [key: string]: boolean } = {};
	let id: string;
	let itemsInItem: Item[] = [];

	onMount(async () => {
		const { params } = await $page;
		id = params.id;

		fetch(`https://raw.githubusercontent.com/shiki-01/m-py-learning/master/word/${id}/index.json`)
			.then((response) => response.json())
			.then((data: { items: Item[] }) => {
				// 'items'キーの下にある配列を取得
				itemsInItem = data.items;
				itemsInItem.forEach((item) => (flipped[item.name] = false));
			});
	});

	function flip(itemName: string) {
		flipped[itemName] = !flipped[itemName];
	}
</script>

<div class="flex justify-center">
	<Button class="w-fit" on:click={() => (location.href = `/word/${id}/test`)}>Start Test !</Button>
</div>
<div class="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
	{#each itemsInItem as item}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="card h-auto min-h-[64px]"
			class:flipped={flipped[item.name]}
			on:click={() => flip(item.name)}
		>
			<div class="card-face card-front">
				<Card>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{item.name}
					</h5>
				</Card>
			</div>
			<div class="card-face card-back">
				<Card>
					<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
						{item.description}
						<!-- Change this line -->
					</p>
				</Card>
			</div>
		</div>
	{/each}
</div>

<style>
	.card {
		transform-style: preserve-3d;
		transition: transform 0.6s;
		height: 100px;
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
