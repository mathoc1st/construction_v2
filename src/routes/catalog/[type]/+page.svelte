<script lang="ts">
	import BuildingCard from '$lib/components/ui/BuildingCard.svelte';
	import SearchFilters from '$lib/components/ui/SearchFilters.svelte';
	import Sorting from '$lib/components/ui/Sorting.svelte';
	import type { Snapshot } from '@sveltejs/kit';
	import { PaginationNav } from 'flowbite-svelte';
	import type { PageProps } from './$types';
	import {
		BuildingType,
		SortBy,
		type ApiResponse,
		type FinishType,
		type GetBuildingsByTypeResponse
	} from '$lib/types';
	import type { getBuildingsByType } from '$lib/server/db/queries/building';
	import { getBuildingTypeName } from '$lib/utils';

	let { data, params }: PageProps = $props();

	let buildings = $derived(data.buildings);
	let currentPage = $state(1);
	let innerWidth = $state(0);
	let visiblePages = $derived.by(() => {
		if (innerWidth < 600) return 3;
		return 5;
	});

	let totalPages = $derived(Math.ceil(data.totalCount / 12));

	async function handlePageChange(page: number) {
		currentPage = page;
		refetch();
	}

	async function refetch() {
		const urlParams = new URLSearchParams();
		urlParams.append('page', currentPage.toString());
		urlParams.append('type', params.type);
		urlParams.append('sortBy', sortByFilter);
		floorsFilter.forEach((f) => {
			urlParams.append('floor', f.toString());
		});
		finishesFilter.forEach((f) => {
			urlParams.append('finish', f);
		});
		sizesFilter.forEach((s) => {
			urlParams.append('size', s);
		});
		if (verandaFilter !== null) urlParams.append('veranda', JSON.stringify(verandaFilter));

		const response = await fetch(`/api/building?${urlParams}`, { method: 'GET' });

		if (!response.ok) console.log(response);

		const result = (await response.json()) as GetBuildingsByTypeResponse;

		if (!result.success) {
			return;
		}

		buildings = result.data.buildings;
		totalPages = Math.ceil(result.data.totalCount / 12);

		setTimeout(() => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth' // scrolls smoothly
			});
		}, 50);
	}

	$effect(() => {
		floorsFilter;
		finishesFilter;
		sizesFilter;
		sortByFilter;
		refetch();
	});

	let floorsFilter: number[] = $state([]);
	let finishesFilter: FinishType[] = $state([]);
	let sizesFilter: string[] = $state([]);
	let verandaFilter: boolean | null = $state(null);
	let sortByFilter: SortBy = $state(SortBy.POPULARITY_DESC);

	export const snapshot: Snapshot<{
		currentPage: number;
		floorsFilter: number[];
		finishesFilter: FinishType[];
		sizesFilter: string[];
	}> = {
		capture: () => ({ currentPage, floorsFilter, finishesFilter, sizesFilter }),
		restore: (value) => {
			currentPage = value.currentPage;
			floorsFilter = value.floorsFilter;
			finishesFilter = value.finishesFilter;
			sizesFilter = value.sizesFilter;
		}
	};
</script>

<svelte:window bind:innerWidth />
<section class="mx-auto mt-26 mb-26 max-w-[1440px] px-5">
	<h1 class="text-center text-5xl font-medium max-[600px]:text-4xl">
		{getBuildingTypeName(params.type.toUpperCase() as BuildingType)}
	</h1>
	<div class="mt-26 flex w-full gap-4 max-[900px]:justify-center">
		<SearchFilters
			details={data.details}
			bind:floorsFilter
			bind:finishesFilter
			bind:sizesFilter
			bind:verandaFilter
		/>
		<Sorting bind:sortBy={sortByFilter} />
	</div>
	<div
		class="mt-12 grid grid-cols-3 gap-y-18 max-[1440px]:grid-cols-2 max-[900px]:grid-cols-1 max-[900px]:place-items-center"
	>
		{#each buildings as building, i (building.id)}
			<BuildingCard {building} />
		{/each}
	</div>
	{#if totalPages > 1}
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
				previousLabel="Пред."
				nextLabel="След."
			/>
		</div>
	{/if}
</section>
