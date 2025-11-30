<script lang="ts">
	import './layout.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href="images/logo.jpg" />
</svelte:head>

<Header isAdmin={data.isAdmin}></Header>

{@render children()}

<Footer />

<style>
	:global([role='tabpanel']) {
		background-color: transparent;
		width: 100%;
		padding: 0;
	}
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
		height: 100%;
		margin: 0;
	}
	:global(html) {
		height: 100%;
		margin: 0;
	}
	:global(button) {
		cursor: pointer;
	}
</style>
