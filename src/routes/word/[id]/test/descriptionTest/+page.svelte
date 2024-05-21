<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, Button, Radio, Modal } from 'flowbite-svelte';
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

	let id: string;
	let itemsInItem: Item[] = [];
	let userAnswer: string = '';
	let currentQuestionIndex: number = 0;
	let options: string[] = [];
	let correctAnswersCount: number = 0;

	onMount(async () => {
		const { params } = await $page;
		id = params.id;

		fetch(`https://raw.githubusercontent.com/shiki-01/m-py-learning/master/assets/assets/word/${id}/index.json`)
			.then((response) => response.json())
			.then((data: { items: Item[] }) => {
				itemsInItem = data.items;
				// Shuffle the items for random questions
				itemsInItem.sort(() => Math.random() - 0.5);
				generateOptions();
			});
	});

	function generateOptions() {
		if (!itemsInItem[currentQuestionIndex]) {
			return;
		}
		// Get all descriptions
		let allDescriptions = itemsInItem.map((item) => item.description);
		// Shuffle the descriptions
		allDescriptions.sort(() => Math.random() - 0.5);
		// Get the first three descriptions as incorrect options
		options = allDescriptions.slice(0, 4); // Modify this line to update the state variable
		// Get the correct answer
		let correctAnswer = itemsInItem[currentQuestionIndex].description;
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

	const checkAnswer = () => {
		let questionAtTimeOfAnswer = itemsInItem[currentQuestionIndex];
		if (userAnswer === questionAtTimeOfAnswer.description) {
			// 正解の処理
			modalContent = '正解！';
			correctAnswersCount++;
		} else {
			// 不正解の処理
			modalContent = '不正解… 答えは  ' + questionAtTimeOfAnswer.name + '  :  ' + questionAtTimeOfAnswer.description;
		}
		// 次の問題に進む
		defaultModal = true;
		currentQuestionIndex++;
		if (currentQuestionIndex < itemsInItem.length) {
			generateOptions();
		} else {
			modalContent = 'Quiz finished!';
			defaultModal = true;
		}
	};

	const closeModal = () => {
		defaultModal = false;
	};

	const selectOption = (option: string) => {
		userAnswer = option;
	};

	// 初期の選択肢を生成
	generateOptions();
</script>

<div class="mb-4 flex justify-center">
	<Button class="w-fit" on:click={() => (location.href = `/word/${id}`)}>Back to List</Button>
</div>
<div class="mt-4 flex justify-center">
	{#if defaultModal}
		<Modal on:close={closeModal} title="結果" bind:open={defaultModal} autoclose>
			<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{modalContent}</p>
			<svelte:fragment slot="footer">
				{#if currentQuestionIndex < itemsInItem.length}
					<Button on:click={closeModal}>Next Question</Button>
				{:else}
					<Button on:click={closeModal}>Close</Button>
				{/if}
			</svelte:fragment>
		</Modal>
	{/if}
	{#if currentQuestionIndex !== undefined && itemsInItem[currentQuestionIndex]}
		<div class="card h-auto min-h-[64px]">
			<Card class="flex gap-2 pb-4">
				<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					{itemsInItem[currentQuestionIndex].name}
				</h5>
				{#each options as option}
					<Radio name="answer" value={option} on:click={() => selectOption(option)}>{option}</Radio>
				{/each}
				<Button class="mt-4" on:click={checkAnswer}>Check Answer</Button>
			</Card>
		</div>
	{/if}
</div>
