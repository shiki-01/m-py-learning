<script lang="ts">
	import { Button, Input, Modal, Heading, Textarea, P } from 'flowbite-svelte';
	import { onMount, afterUpdate } from 'svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { rewriteHTML, injectComponents } from '$lib/utils/middlewares/rewrite-html';

	export let data: PageData;

	let id: string;
	let itemsInItem: any[] = [];

	let currentQuestionIndex: number = 0;
	let correctAnswersCount: number = 0;
	let userAnswer: string = '';
	let modalContent: string = '';
	let defaultModal: boolean = false;
	let finalModal: boolean = false;

	let showModal: boolean = false;

	onMount(async () => {
		const { params } = await $page;
		id = params.id;

		showModal = window.innerWidth < 640;

		const filteredItems = data.quests.contents.filter((item) => item.tag.includes(id));

		if (filteredItems.length > 0) {
			itemsInItem = filteredItems;
		} else {
			itemsInItem = [];
		}
	});

	afterUpdate(() => {
		injectComponents();
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
					console.log(currentQuestion.debug + `\n` + userAnswer);
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

<div class="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
	{#if itemsInItem[currentQuestionIndex]}
		<div class="md:hidden">
			<Button on:click={() => (showModal = true)}>Show Description</Button>
			<Modal bind:open={showModal}>
				{#if itemsInItem[currentQuestionIndex].description}
					<P class="article">{@html rewriteHTML(itemsInItem[currentQuestionIndex].description)}</P>
				{/if}
			</Modal>
		</div>
		<div class="overflow-y-auto">
			<Heading level="2" class="mb-4">{itemsInItem[currentQuestionIndex].title}</Heading>
			<div class="hidden md:block">
				{#if itemsInItem[currentQuestionIndex].description}
					<P class="article">{@html rewriteHTML(itemsInItem[currentQuestionIndex].description)}</P>
				{/if}
			</div>
		</div>
		<div class="flex flex-col justify-center gap-4">
			<div>
				<Button on:click={checkAnswer}>Check Answer</Button>
				<Button>Reset</Button>
			</div>
			{#if itemsInItem[currentQuestionIndex].premiss}
				<div class="article">
					<pre><code>{itemsInItem[currentQuestionIndex].premiss}</code></pre>
				</div>
			{/if}
			<Textarea bind:value={userAnswer} placeholder="Answer" class="w-full" />
		</div>
	{/if}
	{#if defaultModal}
		<Modal
			on:close={() => (defaultModal = false)}
			title="Result"
			bind:open={defaultModal}
			autoclose
		>
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

<style lang="scss">
	:global(.article p) {
		@apply mb-4 text-lg dark:text-gray-50;
	}
	:global(.article pre) {
		@apply mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800;

		:global(code) {
			@apply block overflow-x-auto p-4 dark:text-gray-50;
		}
	}
	:global(code) {
		@apply mx-1 rounded-lg bg-gray-200 px-2 py-1.5 text-sm dark:bg-gray-800 dark:text-gray-50;
	}
	:global(.article h2) {
		@apply mb-4 text-3xl font-bold dark:text-gray-50;
		position: relative;

		:global(a) {
			@apply pr-4 opacity-0;
			cursor: pointer;
			position: absolute;
			left: calc(-1 * 25px);
			transition: all 0.1s ease-in-out;
		}

		&:hover :global(a) {
			@apply opacity-100;
		}
	}
	:global(.article table) {
		display: block;
		@apply mb-8 mt-4 w-full min-w-full table-auto overflow-x-auto;

		:global(th),
		:global(td) {
			@apply whitespace-nowrap text-left font-medium;
		}

		:global(th) {
			@apply bg-gray-200 px-5 py-3 text-xs uppercase text-gray-600 dark:bg-gray-700 dark:text-gray-400;

			:global(p) {
				@apply m-0 text-sm;
			}
		}

		:global(td) {
			@apply p-2 px-5 text-base text-gray-900 dark:bg-gray-800 dark:text-gray-100;

			:global(p) {
				@apply m-0 py-2 text-sm;
			}
		}

		:global(tr) {
			:global(td) {
				@apply border-b border-gray-200 dark:border-gray-700;
			}

			&:hover :global(td) {
				@apply bg-gray-200 dark:bg-gray-600;
			}
		}
	}

	:global(.article table tbody) {
		@apply overflow-x-auto;
	}
</style>
