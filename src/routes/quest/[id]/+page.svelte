<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let id: string;
    let itemsInItem: any[] = [];

	onMount(async () => {
		const { params } = await $page;
		id = params.id;

		fetch(
			`https://raw.githubusercontent.com/shiki-01/m-py-learning/master/assets/quest/${id}/index.json`
		)
			.then((response) => response.json())
			.then((data: { label: any[]; }[]) => {
                itemsInItem = data;
			});
	});

	$: console.log(itemsInItem);
</script>

<div class="flex justify-center gap-3">
	{#each itemsInItem as item}
		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{item.label}
			</h5>
			<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
				{item.description}
			</p>
			<Button class="w-fit" on:click={() => (location.href = `/quest/${id}/${item.label}`)}
				>Get start !</Button
			>
		</Card>
	{/each}
</div>
