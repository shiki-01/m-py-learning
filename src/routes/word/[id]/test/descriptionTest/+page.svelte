<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, Button, Radio, Modal } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import type { Item } from '$lib/utils/types/word';
	import type { PageData } from './$types';

	export let data: PageData;

	interface Word {
		label: string;
		id: string;
		items: Item[];
	}

	let id: string;
	let itemsInItem: Item[] = [];
	let userAnswer: string = '';
	let currentQuestionIndex: number = 0;
	let options: string[] = [];
	let correctAnswersCount: number = 0;

	onMount(async () => {
		const { params } = await $page;
		id = params.id;

		const filteredItems = data.words.contents.filter((item) => item.tag.includes(id));
		if (filteredItems.length > 0) {
			itemsInItem = filteredItems;
		} else {
			itemsInItem = [];
		}

		generateOptions();
	});

	function generateOptions() {
		if (!itemsInItem[currentQuestionIndex]) {
			return;
		}
		// Get all descriptions
		let allDescriptions = itemsInItem.map((item) => item.descriptionS);
		// Shuffle the descriptions
		allDescriptions.sort(() => Math.random() - 0.5);
		// Get the first three descriptions as incorrect options
		options = allDescriptions.slice(0, 4); // Modify this line to update the state variable
		// Get the correct answer
		let correctAnswer = itemsInItem[currentQuestionIndex].descriptionS;
		// Check if the correct answer is in the options
		if (!options.includes(correctAnswer)) {
			// Remove a random option
			options.pop();
			// Add the correct answer
			options.push(correctAnswer);
		}
		// Shuffle the options
		options.sort(() => Math.random() - 0.5);
		// Now options contains the correct answer and two incorrect answers, in random order
	}

	let modalContent = '';

	let defaultModal = false;
	let finalModal = false;

	const checkAnswer = () => {
		let questionAtTimeOfAnswer = itemsInItem[currentQuestionIndex];
		if (userAnswer === questionAtTimeOfAnswer.descriptionS) {
			// 正解の処理
			modalContent = '正解！';
			correctAnswersCount++;
		} else {
			// 不正解の処理
			modalContent = '不正解… 答えは  ' + questionAtTimeOfAnswer.title + '  :  ' + questionAtTimeOfAnswer.descriptionS;
		}
		// 次の問題に進む
		defaultModal = true;
		currentQuestionIndex++;
		if (currentQuestionIndex < itemsInItem.length) {
			generateOptions();
		}
	};

	function closeDefaultModal() {
		defaultModal = false;
		defaultModal = false;
		if (currentQuestionIndex >= itemsInItem.length) {
			finalModal = true;
		}
	}

	function closeFinalModalAndNavigate() {
		finalModal = false;
		location.href = `/word/${id}/test/result?correct=${correctAnswersCount}&total=${itemsInItem.length}`;
	}

	const selectOption = (option: string) => {
		userAnswer = option;
	};

	generateOptions();
</script>

<div class="mb-4 flex justify-center">
	<Button class="w-fit" on:click={() => (location.href = `/word/${id}`)}>Back to List</Button>
</div>
<div class="mt-4 flex justify-center">
	{#if defaultModal}
		<Modal on:close={closeDefaultModal} title="結果" bind:open={defaultModal} autoclose>
			<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{modalContent}</p>
			<svelte:fragment slot="footer">
				{#if currentQuestionIndex < itemsInItem.length}
					<Button on:click={closeDefaultModal}>Next Question</Button>
				{:else}
					<Button on:click={closeDefaultModal}>Close</Button>
				{/if}
			</svelte:fragment>
		</Modal>
	{/if}
	{#if finalModal}
			<Modal on:close={closeFinalModalAndNavigate} title="終了" bind:open={finalModal} autoclose>
				<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
					テストが終了しました。
				</p>
				<svelte:fragment slot="footer">
					<Button on:click={closeFinalModalAndNavigate}>Close</Button>
				</svelte:fragment>
			</Modal>
		{/if}
	{#if currentQuestionIndex !== undefined && itemsInItem[currentQuestionIndex]}
		<div class="card h-auto min-h-[64px]">
			<Card class="flex gap-2 pb-4">
				<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					{itemsInItem[currentQuestionIndex].title}
				</h5>
				{#each options as option}
					<Radio name="answer" value={option} on:click={() => selectOption(option)}>{option}</Radio>
				{/each}
				<Button class="mt-4" on:click={checkAnswer}>Check Answer</Button>
			</Card>
		</div>
	{/if}
</div>
