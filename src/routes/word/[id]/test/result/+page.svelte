<script lang="ts">
    import { onMount } from 'svelte';
    import { Card, Button, Rating } from 'flowbite-svelte';
    import { page } from '$app/stores';

    let id: string;
    let correct: number = 0;
    let total: number = 0;
    let rating: number = 2;

    onMount(async () => {
        const { params } = await $page;
        id = params.id;
        const url = new URL($page.url);
        correct = Math.max(0, Number(url.searchParams.get('correct')));
        total = Math.max(0, Number(url.searchParams.get('total')));
    });

    $: {
        if (total > 0) {
            rating = Math.min((correct / total) * 5, 5);
        } else {
            rating = 0;
        }
        console.log(rating);
    }
</script>

<div class="flex flex-col space-y-4">
    <div class="flex justify-center">
        <Button class="w-fit" on:click={() => (location.href = `/word/${id}`)}>Back to List</Button>
    </div>
    <div class="flex justify-center pt-4">
        <Card class="gap-3">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Test Results
            </h5>
            <p>あなたの答えは、 {correct} 問中 {total} 問正解でした.</p>
            <Rating id="test-result-rating" total={5} size={50} {rating} key={rating} />
        </Card>
    </div>
</div>