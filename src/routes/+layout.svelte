<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
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
			const capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
			return { segment: capitalizedSegment, href };
		});
	}
</script>

<header>
	<Navbar let:toggle color="primary">
		<NavBrand href="/">
			<img src="https://placehold.jp/150x150.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-red-500"
				>M Py Learning</span
			>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl>
			<DarkMode />
			<NavUl>
				<NavLi href="/" active={true}>Home</NavLi>
				<NavLi href="/about">About</NavLi>
				<NavLi href="/word">Word</NavLi>
				<NavLi href="/quest">Quest</NavLi>
			</NavUl>
		</NavUl>
	</Navbar>
</header>
<div class="bread dark:bg-gray-700">
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
	.bread {
		padding: 1rem;
	}
	main {
		min-height: 100vh;
	}
</style>
