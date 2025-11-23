<script lang="ts">
	import BuildingCard from '$lib/components/ui/BuildingCard.svelte';
	import SearchFilters from '$lib/components/ui/SearchFilters.svelte';
	import Sorting from '$lib/components/ui/Sorting.svelte';
	import type { Snapshot } from '@sveltejs/kit';
	import { PaginationNav } from 'flowbite-svelte';

	let currentPage = $state(1);
	let innerWidth = $state(0);
	let visiblePages = $derived.by(() => {
		if (innerWidth < 600) return 3;
		return 5;
	});

	const totalPages = 20;

	function handlePageChange(page: number) {
		currentPage = page;
	}

	export const snapshot: Snapshot<{
		currentPage: number;
	}> = {
		capture: () => ({ currentPage }),
		restore: (value) => {
			currentPage = value.currentPage;
		}
	};
</script>

<svelte:window bind:innerWidth />
<section class="mt-26 mb-26 w-full">
	<h1 class="text-center text-5xl font-medium max-[600px]:text-4xl">Каркасные дома</h1>
	<div class="mt-26 flex w-full gap-4 max-[900px]:justify-center">
		<SearchFilters />
		<Sorting />
	</div>
	<div
		class="mt-12 grid grid-cols-3 gap-y-18 max-[1440px]:grid-cols-2 max-[900px]:grid-cols-1 max-[900px]:place-items-center"
	>
		{#each { length: 10 }}
			<BuildingCard />
		{/each}
	</div>

	<div class="mx-auto mt-20 w-max">
		<PaginationNav
			classes={{
				prev: 'bg-light-brown text-off-white border-2 border-light-olive hover:bg-dark-olive hover:text-off-white',
				next: 'bg-light-brown text-off-white border-2 border-light-olive hover:bg-dark-olive hover:text-off-white',
				active: 'bg-dark-olive! text-off-white! hover:text-off-white!'
			}}
			class="border-light-olive paginator"
			size="large"
			{visiblePages}
			{currentPage}
			{totalPages}
			onPageChange={handlePageChange}
		/>
	</div>
</section>
