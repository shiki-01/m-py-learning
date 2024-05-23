<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, Button, Input, Modal } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import type { Item } from '$lib/utils/types/word';
	import type { PageData } from '../$types';

	export let data: PageData;

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

		const filteredItems = data.words.contents.filter((item) => item.tag.includes(id));
		if (filteredItems.length > 0) {
			// itemsプロパティが存在しないため、代わりにtitleを設定します
			itemsInItem = filteredItems;
		} else {
			itemsInItem = [];
		}
	});

	let defaultModal = false;
	let finalModal = false;
	let modalContent = '';

	function checkAnswer() {
		const item = itemsInItem[currentQuestionIndex];
		if (userAnswers[item.title] === item.title) {
			modalContent = '正解！';
			correctAnswersCount++;
		} else {
			modalContent = '間違い！ 正解は： ' + item.title;
		}
		// Move to the next question
		defaultModal = true;
		currentQuestionIndex++;
	}

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
						{currentQuestion.descriptionS}
					</h5>
					<Input
						bind:value={userAnswers[currentQuestion.title]}
						placeholder="Enter the word here"
					/>
					<Button on:click={checkAnswer}>Check Answer</Button>
				</Card>
			</div>
		{/if}
		{#if defaultModal}
			<Modal on:close={closeDefaultModal} title="結果" bind:open={defaultModal} autoclose>
				<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{modalContent}</p>
				<svelte:fragment slot="footer">
					<Button on:click={closeDefaultModal}>Close</Button>
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
	</div>
</div>
