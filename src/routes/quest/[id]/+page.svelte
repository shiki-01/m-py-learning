<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    let id: string;

    onMount(async () => {
        const { params } = await $page;
        id = params.id;

    });
</script>

<div class="flex justify-center gap-3">
</div>
