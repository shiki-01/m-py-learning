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

	let data = null;
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

		const response = await fetch(`https://raw.githubusercontent.com/shiki-01/m-py-learning/master/word/${id}/index.svelte`);
    	if (response.ok) {
      		data = await response.text();
    	}
	});

	function flip(itemName: string) {
		flipped[itemName] = !flipped[itemName];
	}
</script>

<div class="flex justify-center">
	<Button class="w-fit" on:click={() => (location.href = `/word/${id}/test`)}>Start Test !</Button>
</div>
<div class="grid-auto-rows grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
	{#each itemsInItem as item}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="card relative h-auto min-h-[64px]"
			class:flipped={flipped[item.name]}
			on:click={() => flip(item.name)}
		>
			<div class="card-face card-front absolute inset-0">
				<Card>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{item.name}
					</h5>
				</Card>
			</div>
			<div class="card-face card-back absolute inset-0">
				<Card>
					<div class="card-con">
						<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
							{item.description}
						</p>
					</div>
				</Card>
			</div>
		</div>
	{/each}
</div>
{#if data}
  <div>
    {data}
  </div>
{:else}
  <div>Loading...</div>
{/if}

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
