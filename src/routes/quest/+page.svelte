<script lang="ts">
    import { onMount } from 'svelte';
    import { Card, Button } from 'flowbite-svelte';

    let quests: any[] = [];

    onMount(() => {
        fetch('https://raw.githubusercontent.com/shiki-01/m-py-learning/master/assets/quest/index.json')
            .then((response) => response.json())
            .then((data) => (quests = data));
    });
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each quests as quest}
        <Card>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {quest.label}
            </h5>
            <p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
                {quest.description}
            </p>
            <Button class="w-fit" on:click={() => (location.href = `/quest/${quest.id}`)}>
                Get start !
            </Button>
        </Card>
    {/each}
</div>