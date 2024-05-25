<script lang="ts">
    import { onMount } from 'svelte';
    import { Card, Button } from 'flowbite-svelte';
    import type { PageData } from '../$types';

    export let data: PageData;

    let contentsW: any[] = [];

    onMount(() => {
        const grouped = data.words.contents.reduce((acc: { [x: string]: any[]; }, item: { tag: string | number; }) => {
            if (item.tag) {
                if (!acc[item.tag]) {
                    acc[item.tag] = [];
                }
                acc[item.tag].push(item);
            }
            return acc;
        }, {});

        contentsW = Object.values(grouped).map(group => group[0]).reverse();
    });
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each contentsW as content}
        <Card>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {content.tag}
            </h5>
            <Button class="w-fit" on:click={() => (location.href = `/word/${content.tag}`)}>
                Get start !
            </Button>
        </Card>
    {/each}
</div>