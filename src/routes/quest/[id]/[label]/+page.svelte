<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Input, Modal, Heading, Textarea } from 'flowbite-svelte';
	import { page } from '$app/stores';

	interface Question {
		question: string;
		answer: string;
	}

	let itemsInItem: Question[] = [];
	let userAnswer = '';
	let currentQuestionIndex = 0;
	let correctAnswersCount = 0;
	let defaultModal = false;
	let modalContent = '';

	onMount(async () => {
		const { params } = await $page;
		const id = params.id;
		const label = params.label;

		// ここで問題のJSONを取得します
		const response = await fetch(
			`https://raw.githubusercontent.com/shiki-01/m-py-learning/master/assets/quest/${id}/${label}/index.json`
		);
		const data = await response.json();
		itemsInItem = data.questions;

		// Pyodideをロードします
		const pyodideScript = document.createElement('script');
		pyodideScript.src = 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js';
		document.body.appendChild(pyodideScript);
		pyodideScript.onload = async () => {
			if (!window.pyodide && !window.pyodideLoading) {
				window.pyodideLoading = true;
				window.pyodide = await window.loadPyodide({
					indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/'
				});
				window.pyodideLoading = false;
			}
		};
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
			if (currentQuestion.advance) {
				await window.pyodide.runPythonAsync(currentQuestion.advance);
			}

			// ここでPythonコードを実行します
			await window.pyodide.runPythonAsync(userAnswer);

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
					await window.pyodide.runPythonAsync(currentQuestion.debug);
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

{#if itemsInItem[currentQuestionIndex]}
	<div class="mb-4 flex justify-center">
		<Heading tag="h3" class="w-fit">{itemsInItem[currentQuestionIndex].question}</Heading>
	</div>
	<Textarea bind:value={userAnswer} placeholder="Python code here" class="m-4" />
	<div class="flex justify-center">
		<Button class="w-fit" on:click={checkAnswer}>Check Answer</Button>
	</div>
{/if}
{#if defaultModal}
	<Modal on:close={() => (defaultModal = false)} title="結果" bind:open={defaultModal} autoclose>
		<p>{modalContent}</p>
		<svelte:fragment slot="footer">
			<Button on:click={() => (defaultModal = false)}>Close</Button>
		</svelte:fragment>
	</Modal>
{/if}
