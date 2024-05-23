<script lang="ts">
	import { Button, Input, Modal, Heading, Textarea, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	let id: string;
	let itemsInItem: any[] = [];

	let currentQuestionIndex: number = 0;
	let correctAnswersCount: number = 0;
	let userAnswer: string = '';
	let modalContent: string = '';
	let defaultModal: boolean = false;
	let finalModal: boolean = false;

	onMount(async () => {
		const { params } = await $page;
		id = params.id;

		const filteredItems = data.quests.contents.filter((item) => item.tag.includes(id));

		if (filteredItems.length > 0) {
			itemsInItem = filteredItems;
		} else {
			itemsInItem = [];
		}
	});

	onMount(async () => {
		const pyodideScript = document.createElement('script');
		pyodideScript.src = 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js';
		document.body.appendChild(pyodideScript);

		await new Promise((resolve) => (pyodideScript.onload = resolve));

		if (!window.pyodide && !window.pyodideLoading) {
			window.pyodideLoading = true;
			window.pyodide = await window.loadPyodide({
				indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/'
			});
			window.pyodideLoading = false;
		}
	});

	const checkAnswer = async () => {
		while (window.pyodideLoading) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		if (!window.pyodide) {
			console.error('Pyodide is not initialized yet');
			return;
		}

		if (currentQuestionIndex >= itemsInItem.length) {
			modalContent = 'テストが終了しました！ 正解数：' + correctAnswersCount;
			defaultModal = true;
			return;
		}

		const currentQuestion = itemsInItem[currentQuestionIndex];
		try {
			// Pythonの標準出力を一時的にリダイレクトします
			window.pyodide.runPython('import sys, io');
			window.pyodide.runPython('originalStdout = sys.stdout; sys.stdout = io.StringIO()');

			// advanceフィールドが存在する場合、そのコードを先に実行します
			if (currentQuestion.premiss) {
				if (currentQuestion.debug) {
					await window.pyodide.runPythonAsync(currentQuestion.debug + `\n` + userAnswer);
					console.log(currentQuestion.debug + `\n` + userAnswer)
				} else {
					await window.pyodide.runPythonAsync(currentQuestion.premiss + `\n` + userAnswer);
				}
			} else {
				await window.pyodide.runPythonAsync(userAnswer);
			}

			// Pythonの標準出力を取得します
			const result = window.pyodide.runPython('sys.stdout.getvalue()');

			// Pythonの標準出力を元に戻します
			window.pyodide.runPython('sys.stdout = originalStdout');

			console.log(result);
			console.log(currentQuestion.answer);
			if (result.trim() === currentQuestion.answer) {
				modalContent = '正解！';
				correctAnswersCount++;
			} else {
				// debugフィールドが存在する場合、そのコードを実行してエラーメッセージを生成します
				if (currentQuestion.debug) {
					// advanceフィールドをdebugフィールドで上書きします
					await window.pyodide.runPythonAsync(currentQuestion.debug + `\n` + userAnswer);
					const debugResult = window.pyodide.runPython('sys.stdout.getvalue()');
					modalContent =
						'不正解… 答えは ' + currentQuestion.answer + ' デバッグ結果: ' + debugResult;
				} else {
					modalContent = '不正解… 答えは ' + currentQuestion.answer;
				}
			}
		} catch (error) {
			console.error('Error running Python code:', error);
		}
		defaultModal = true;
		userAnswer = '';
		currentQuestionIndex++;
	};
</script>

<div class="flex justify-center gap-3">
	{#if itemsInItem[currentQuestionIndex]}
		<div>
			<Heading level="2" class="mb-4">{itemsInItem[currentQuestionIndex].title}</Heading>
			{#if itemsInItem[currentQuestionIndex].premiss}
				<P>{itemsInItem[currentQuestionIndex].premiss}</P>
			{/if}
		</div>
		<div class="flex justify-center">
			<Textarea bind:value={userAnswer} placeholder="Answer" class="w-96" />
			<Button on:click={checkAnswer}>Check Answer</Button>
		</div>
	{/if}
	{#if defaultModal}
		<Modal on:close={() => (defaultModal = false)} title="Result" bind:open={defaultModal} autoclose>
			<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">{modalContent}</p>
			<svelte:fragment slot="footer">
				{#if currentQuestionIndex < itemsInItem.length}
					<Button on:click={() => (defaultModal = false)}>Next Question</Button>
				{:else}
					<Button on:click={() => (defaultModal = false)}>Close</Button>
				{/if}
			</svelte:fragment>
		</Modal>
	{/if}
	{#if finalModal}
		<Modal title="Result" bind:open={defaultModal} autoclose>
			<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
				Test is over! Correct answers: {correctAnswersCount}
			</p>
			<svelte:fragment slot="footer">
				<Button on:click={() => (defaultModal = false)}>Close</Button>
			</svelte:fragment>
		</Modal>
	{/if}
</div>
