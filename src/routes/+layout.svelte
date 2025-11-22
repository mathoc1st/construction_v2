<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header></Header>

<div class="mx-auto flex max-w-[1440px] flex-col items-center overflow-clip px-5">
	{@render children()}
</div>

<style>
	:global(html) {
		box-sizing: border-box;
	}

	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: inherit;
	}
	:global(body) {
		font-family: 'Roboto Slab', serif;
		background-color: #fefae0;
	}
	:global(button) {
		cursor: pointer;
	}
</style>
