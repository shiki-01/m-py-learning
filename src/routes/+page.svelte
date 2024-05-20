<script>
	import { Card, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
</script>

<div class="card">
	<Card>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			単語・文法を覚える
		</h5>
		<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
			単語帳を使って、Python の基本的な単語や文法などを覚えよう！
		</p>
		<Button class="w-fit" on:click={() => location.href='/word'}>
			Get start ! <ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
		</Button>
	</Card>
    <Card>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			問題を解く
		</h5>
		<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
			実践問題を解くことでさらに理解を深めよう！
		</p>
		<Button class="w-fit" on:click={() => location.href='/quest'}>
			Get start ! <ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
		</Button>
	</Card>
</div>
<div class="p-8">
    <p class="text-2xl font-bold text-gray-900 dark:text-white">M Py Learning とは？</p>
    <div class="p-2">
        <p class="text-gray-700 dark:text-gray-400 pt-2">M Py Learning は、Python の基本的な単語や文法を学ぶための学習サイトです。</p>
        <p class="text-gray-700 dark:text-gray-400 pt-2">
            Python は、初心者にもわかりやすいプログラミング言語として人気があります。
            このサイトでは、Python の基本的な単語や文法を学ぶことができます。
        </p>
    </div>
</div>

<style lang="scss">
    .card {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
    }
</style>
