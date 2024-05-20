<script lang="ts">
    import { onMount } from 'svelte';
    import { Card, Button, Radio } from 'flowbite-svelte';
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
    let userAnswer: string = '';
    let currentQuestionIndex: number = 0;
    let options: string[] = [];

    onMount(async () => {
        const { params } = await $page;
        id = params.id;

        fetch('https://raw.githubusercontent.com/shiki-01/m-py-learning/master/word/index.json')
            .then((response) => response.json())
            .then((data: Word[]) => {
                words = data;
                const word = words.find(word => word.id === id);
                if (word) {
                    itemsInItem = word.items;
                    // Shuffle the items for random questions
                    itemsInItem.sort(() => Math.random() - 0.5);
                    generateOptions();
                }
            });
    });

    function generateOptions() {
        // Get all descriptions
        let allDescriptions = itemsInItem.map(item => item.description);
        // Shuffle the descriptions
        allDescriptions.sort(() => Math.random() - 0.5);
        // Get the first three descriptions as incorrect options
        options = allDescriptions.slice(0, 3);
        // Add the correct answer to the options
        options.push(itemsInItem[currentQuestionIndex].description);
        // Shuffle the options
        options.sort(() => Math.random() - 0.5);
    }

    function checkAnswer() {
        if (userAnswer === itemsInItem[currentQuestionIndex].description) {
            alert('Correct!');
        } else {
            alert('Incorrect. The correct answer is: ' + itemsInItem[currentQuestionIndex].description);
        }
        // Move to the next question
        currentQuestionIndex++;
        if (currentQuestionIndex >= itemsInItem.length) {
            alert('Test completed!');
            currentQuestionIndex = 0;  // Reset for the next test
        } else {
            generateOptions();
            userAnswer = '';  // Reset the user's answer for the next question
        }
    }

    let currentQuestion = itemsInItem[currentQuestionIndex];
    $: currentQuestion = itemsInItem[currentQuestionIndex];
</script>

<div class="flex justify-center">
    <Button class="w-fit" on:click={() => location.href=`/word/${id}`}>Back to List</Button>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#if currentQuestion}
    <div class="card h-auto min-h-[64px]">
        <Card>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {currentQuestion.name}
            </h5>
            {#each options as option}
                <Radio name="answer" value={option} bind:model={userAnswer}>{option}</Radio>
            {/each}
            <Button on:click={checkAnswer}>Check Answer</Button>
        </Card>
    </div>
    {/if}
</div>
