<script lang="ts">
    let words: any[] = [];

    fetch('https://raw.githubusercontent.com/shiki-01/m-py-learning/master/word/index.json')
    .then(response => response.json())
    .then(data => words = data);

    import { Card, Button } from 'flowbite-svelte';
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each words as word}
        <Card>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {word.label}
            </h5>
            <p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
                {word.description}
            </p>
            <Button class="w-fit" on:click={() => location
            .href=`/word/${word.id}`}>
                Get start !
            </Button>
        </Card>
    {/each}
</div>