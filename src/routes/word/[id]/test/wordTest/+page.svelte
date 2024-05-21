<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, Button, Input, Modal } from 'flowbite-svelte';
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
	let id: string;
	let itemsInItem: Item[] = [];
	let userAnswers: { [key: string]: string } = {};
	let currentQuestionIndex: number = 0;
	let correctAnswersCount: number = 0;

	onMount(async () => {
		const { params } = await $page;
		id = params.id;

		fetch(`https://raw.githubusercontent.com/shiki-01/m-py-learning/master/word/${id}/index.json`)
			.then((response) => response.json())
			.then((data: { items: Item[] }) => {
				itemsInItem = data.items;
				// Shuffle the items for random questions
				itemsInItem.sort(() => Math.random() - 0.5);
			});
	});

	let defaultModal = false;
	let modalContent = '';

	function checkAnswer() {
		const item = itemsInItem[currentQuestionIndex];
		if (userAnswers[item.name] === item.name) {
			modalContent = '正解！';
			correctAnswersCount++;
		} else {
			modalContent = '間違い！ 正解は： ' + item.name;
		}
		// Move to the next question
		defaultModal = true;
		currentQuestionIndex++;
		if (currentQuestionIndex >= itemsInItem.length) {
			modalContent = 'Test completed!';
			currentQuestionIndex = 0; // Reset for the next test
			window.location.href = `/word/${id}/test/result?correct=${correctAnswersCount}&total=${itemsInItem.length}`;
		}
	}

	let currentQuestion = itemsInItem[currentQuestionIndex];
	$: currentQuestion = itemsInItem[currentQuestionIndex];
</script>

<div class="flex flex-col space-y-4">
	<div class="flex justify-center">
		<Button class="w-fit" on:click={() => (location.href = `/word/${id}`)}>Back to List</Button>
	</div>
	<div class="flex h-screen justify-center pt-4">
		{#if currentQuestion}
			<div class="card h-auto min-h-[64px]">
				<Card class="gap-3">
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{currentQuestion.description}
					</h5>
					<Input bind:value={userAnswers[currentQuestion.name]} placeholder="Enter the word here" />
					<Button on:click={checkAnswer}>Check Answer</Button>
				</Card>
			</div>
		{/if}
		{#if defaultModal}
			<Modal
				on:close={() => (defaultModal = false)}
				title="結果"
				bind:open={defaultModal}
				autoclose
			>
				<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{modalContent}</p>
				<svelte:fragment slot="footer">
					<Button on:click={() => (defaultModal = false)}>Close</Button>
				</svelte:fragment>
			</Modal>
		{/if}
	</div>
</div>
