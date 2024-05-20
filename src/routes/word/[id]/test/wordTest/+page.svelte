<script lang="ts">
    import { onMount } from 'svelte';
    import { Card, Button, Input } from 'flowbite-svelte';
    import { page } from '$app/stores';

    interface Item {
        name: string;
        description: string;
        syntax: string;
    }

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

        fetch((`https://raw.githubusercontent.com/shiki-01/m-py-learning/master/word/${id}/index.json`)
            .then((response) => response.json())
            .then((data: Word[]) => {
                words = data;
                const word = words.find((word) => word.id === id);
                if (word) {
                    itemsInItem = word.items;
                    // Shuffle the items for random questions
                    itemsInItem.sort(() => Math.random() - 0.5);
                }
            });
    });

    function checkAnswer() {
        const item = itemsInItem[currentQuestionIndex];
        if (userAnswers[item.name] === item.name) {
            alert('正解！');
            correctAnswersCount++;
        } else {
            alert('間違い！ 正解は： ' + item.name);
        }
        // Move to the next question
        currentQuestionIndex++;
        if (currentQuestionIndex >= itemsInItem.length) {
            alert('Test completed!');
            currentQuestionIndex = 0;  // Reset for the next test
            window.location.href = `/word/${id}/test/result?correct=${correctAnswersCount}&total=${itemsInItem.length}`;
        }
    }

    let currentQuestion = itemsInItem[currentQuestionIndex];
    $: currentQuestion = itemsInItem[currentQuestionIndex];
</script>

<div class="flex flex-col space-y-4">
    <div class="flex justify-center">
        <Button class="w-fit" on:click={() => (location.href = `/word/${id}`)}>Back to List</Button>
    </div>
    <div class="h-screen flex justify-center pt-4">
        {#if currentQuestion}
            <div class="card h-auto min-h-[64px]">
                <Card class="gap-3">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {currentQuestion.description}
                    </h5>
                    <Input bind:value={userAnswers[currentQuestion.name]} placeholder="Enter the word here" />
                    <Button on:click={checkAnswer}>Check Answer</Button>
                </Card>
            </div>
        {/if}
    </div>
</div>
