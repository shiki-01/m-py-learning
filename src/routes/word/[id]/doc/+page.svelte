<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Card,
		Button,
		P,
		Heading,
		Span,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { page } from '$app/stores';

	interface Item {
		name: string;
		description: string;
		syntax: string;
	}

	let id: string;
	let contentData: { title?: any; content?: any };
	let itemsInItem: Item[] = [];

	onMount(async () => {
		const { params } = await $page;
		id = params.id;

		const isDev = false;

		if (isDev) {
			contentData = {
				title: '文字列型について知ろう',
				content: [
					{
						type: 'text',
						text: 'Pythonにおいて文字列型はstr型で表されます。文字列型のデータはシングルクォーテーション（\'）もしくはダブルクォーテーション（"）で囲むことで表現します。'
					},
					{
						type: 'text',
						text: '文字列型のデータに対しては、文字列の長さを取得するlen()関数や、文字列内で指定した値が出現する位置を取得するfind()メソッド、index()メソッド、count()メソッド、replace()メソッド、split()メソッド、join()メソッドなどが用意されています。'
					},
					{
						type: 'text',
						text: 'それぞれのメソッドや関数について詳しく見ていきましょう。'
					},
					{
						type: 'table',
						head: ['メソッド', '説明', '使用例'],
						body: [
							['len()', '文字列の長さを取得する', 'len("Hello") -> 5'],
							['find()', '指定した値が出現する位置を取得する', '"Hello".find("l") -> 2'],
							['index()', '指定した値が出現する位置を取得する', '"Hello".index("l") -> 2'],
							['count()', '指定した値が出現する回数を取得する', '"Hello".count("l") -> 2'],
							['replace()', '指定した値を置換する', '"Hello".replace("l", "L") -> "HeLLo"'],
							['split()', '指定した値で文字列を分割する', '"Hello".split("l") -> ["He", "", "o"]'],
							['join()', '指定した値で文字列を結合する', '"Hello".join("l") -> "Hlelllo"']
						]
					}
				]
			};
		} else {
			fetch(`https://raw.githubusercontent.com/shiki-01/m-py-learning/master/assets/word/${id}/index.json`)
				.then((response) => response.json())
				.then((data: { items: Item[]; doc: {} }) => {
					console.log(data);
					itemsInItem = data.items;

					contentData = data.doc;
				});
		}
	});
</script>

<Button class="w-fit mb-4" on:click={() => (location.href = `/word/${id}`)}>Back to List</Button>
{#if contentData}
	<Heading tag="h1" class="mb-4"
		><Span underline decorationClass="decoration-8">{contentData.title}</Span></Heading
	>
	<div class="m-4 pt-4">
		{#each contentData.content as content}
			{#if content.type === 'text'}
				<P class="mb-3">{content.text}</P>
			{/if}
			{#if content.type === 'table'}
				<Table>
					<TableHead>
						{#each content.head as head}
							<TableHeadCell>{head}</TableHeadCell>
						{/each}
					</TableHead>
					<TableBody>
						{#each content.body as row}
							<TableBodyRow>
								{#each row as cell}
									<TableBodyCell>{cell}</TableBodyCell>
								{/each}
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			{/if}
		{/each}
	</div>
{:else}
	<p>loading...</p>
{/if}
