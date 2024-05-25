<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, Button, Rating } from 'flowbite-svelte';
	import { page } from '$app/stores';

	let id: string;
	let correct: number = 0;
	let total: number = 0;
	let point: number = 0;
	let rating: number = 0;

	$: if (total > 0) {
		rating = Math.min((correct / total) * 5, 5);
		rating = Number(rating.toFixed(1));
	} else {
		rating = 0;
	}

	onMount(async () => {
		const { params } = await $page;
		id = params.id;
		const url = new URL($page.url);
		correct = Math.max(0, Number(url.searchParams.get('correct')));
		total = Math.max(0, Number(url.searchParams.get('total')));
		point = Math.max(0, Number(url.searchParams.get('point')));
	});
</script>

<div class="flex flex-col space-y-4">
	<div class="flex justify-center">
		<Button class="w-fit" on:click={() => (location.href = `/word/${id}`)}>Back to List</Button>
	</div>
	<div class="flex justify-center pt-4">
		<Card class="gap-3">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Test Results
			</h5>
			<p>あなたの答えは、 {correct} 問中 {total} 問正解でした.</p>
			<p>得点は、 {point} 点です.</p>
			{#if total > 0}
				<Rating id="test-result-rating" total={5} size={50} {rating}>
					<p slot="text" class="ms-2 text-sm font-medium text-gray-500 dark:text-gray-400">
						{rating} out of 5
					</p>
				</Rating>
			{/if}
		</Card>
	</div>
</div>
