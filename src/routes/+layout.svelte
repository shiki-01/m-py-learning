<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import icon from '$lib/favicon.png';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		DarkMode
	} from 'flowbite-svelte';

	let breadcrumbs: any[] = [];

	$: {
		const { pathname } = $page.url;
		const segments = pathname.split('/').filter(Boolean);
		breadcrumbs = segments.map((segment: any, index: number) => {
			const href = '/' + segments.slice(0, index + 1).join('/');
			const decodedSegment = decodeURIComponent(segment);
			const capitalizedSegment = decodedSegment.charAt(0).toUpperCase() + decodedSegment.slice(1);
			return { segment: capitalizedSegment, href };
		});
	}
</script>

<header>
	<Navbar let:toggle color="primary">
		<NavBrand href="/">
			<img src={icon} class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-red-500"
				>M Py Learning</span
			>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl>
			<NavLi><DarkMode /></NavLi>
			<NavLi class="h-full nav-li" href="/" active={true}>Home</NavLi>
			<NavLi class="h-full nav-li" href="/about">About</NavLi>
			<NavLi class="h-full nav-li" href="/word">Word</NavLi>
			<NavLi class="h-full nav-li" href="/quest">Quest</NavLi>
		</NavUl>
	</Navbar>
</header>
<div class="bread overflow-x-auto dark:bg-gray-700">
	<Breadcrumb aria-label="Default breadcrumb example">
		<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
		{#each breadcrumbs as { segment, href }}
			<BreadcrumbItem {href}>{segment}</BreadcrumbItem>
		{/each}
	</Breadcrumb>
</div>
<main class="p-8 dark:bg-gray-600">
	<slot />
</main>

<style lang="scss">
	:global(body) {
		@apply dark:bg-gray-600;
	}
	:global(.nav-li) {
		display: flex;
		align-items: center;
	}
	.bread {
		padding: 1rem;
	}
</style>
