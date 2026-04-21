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
		type FinishType,
		type GetBuildingsByTypeResponse
	} from '$lib/types';
	import { getBuildingTypeName } from '$lib/utils';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	let { data, params }: PageProps = $props();

	let buildings = $derived(data.buildings);

	let totalPages = $derived(Math.ceil(data.totalCount / 12));
	let visiblePages = $derived.by(() => {
		if (innerWidth < 600) return 3;
		return 5;
	});
	let currentPage = $state(1);

	let innerWidth = $state(0);

	async function handlePageChange(page: number) {
		currentPage = page;
		refetch();
	}

	// Filters state
	let selectedFloors: number[] = $state([]);
	let selectedFinishTypes: FinishType[] = $state([]);
	let selectedSizes: string[] = $state([]);
	let selectedVeranda: boolean | null = $state(null);

	async function refetch() {
		const urlParams = new SvelteURLSearchParams();
		urlParams.append('page', currentPage.toString());
		urlParams.append('type', params.type);
		urlParams.append('sortBy', sortByFilter);
		selectedFloors.forEach((f) => {
			urlParams.append('floor', f.toString());
		});
		selectedFinishTypes.forEach((f) => {
			urlParams.append('finish', f);
		});
		selectedSizes.forEach((s) => {
			urlParams.append('size', s);
		});
		if (selectedVeranda !== null) urlParams.append('veranda', JSON.stringify(selectedVeranda));

		const response = await fetch(`/api/building?${urlParams}`, { method: 'GET' });

		if (!response.ok) {
			console.error('Network response was not ok:', response.statusText);
			return;
		}

		const result = (await response.json()) as GetBuildingsByTypeResponse;

		if (!result.success) {
			console.error('Failed to fetch buildings:', result);
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

	let sortByFilter: SortBy = $state(SortBy.POPULARITY_DESC);

	export const snapshot: Snapshot<{
		currentPage: number;
		floorsFilter: number[];
		finishesFilter: FinishType[];
		sizesFilter: string[];
		verandaFilter: boolean | null;
	}> = {
		capture: () => ({
			currentPage,
			floorsFilter: selectedFloors,
			finishesFilter: selectedFinishTypes,
			sizesFilter: selectedSizes,
			verandaFilter: selectedVeranda
		}),
		restore: (value) => {
			currentPage = value.currentPage;
			selectedFloors = value.floorsFilter;
			selectedFinishTypes = value.finishesFilter;
			selectedSizes = value.sizesFilter;
			selectedVeranda = value.verandaFilter;
		}
	};

	async function onFloorsChanged(value: number) {
		const index = selectedFloors.findIndex((f) => f === value);
		if (index === -1) {
			selectedFloors = [...selectedFloors, value];
		} else {
			selectedFloors = selectedFloors.filter((f) => f !== value);
		}
		await refetch();
	}

	async function onFinishTypesChanged(value: FinishType) {
		const index = selectedFinishTypes.findIndex((f) => f === value);
		if (index === -1) {
			selectedFinishTypes = [...selectedFinishTypes, value];
		} else {
			selectedFinishTypes = selectedFinishTypes.filter((f) => f !== value);
		}
		await refetch();
	}

	async function onSizesChanged(value: string) {
		const index = selectedSizes.findIndex((s) => s === value);
		if (index === -1) {
			selectedSizes = [...selectedSizes, value];
		} else {
			selectedSizes = selectedSizes.filter((s) => s !== value);
		}
		await refetch();
	}

	async function onSelectChanged(value: boolean | null) {
		selectedVeranda = value;
		await refetch();
	}

	async function onResetFilters() {
		selectedFloors = [];
		selectedFinishTypes = [];
		selectedSizes = [];
		selectedVeranda = null;

		await refetch();
	}

	async function onSortByChanged(value: SortBy) {
		sortByFilter = value;
		await refetch();
	}
</script>

<svelte:window bind:innerWidth />
<section class="mx-auto mt-26 mb-26 max-w-[1440px] px-5">
	<h1 class="text-center text-5xl font-medium max-[600px]:text-4xl">
		{getBuildingTypeName(params.type.toUpperCase() as BuildingType)}
	</h1>
	<div class="mt-26 flex w-full gap-4 max-[900px]:justify-center">
		<SearchFilters
			options={{
				floors: data.details.floors,
				finishTypes: data.details.finishes,
				sizes: data.details.sizes
			}}
			filters={{
				floors: selectedFloors,
				finishTypes: selectedFinishTypes,
				sizes: selectedSizes,
				hasVeranda: selectedVeranda
			}}
			{onFloorsChanged}
			{onFinishTypesChanged}
			{onSizesChanged}
			{onSelectChanged}
			{onResetFilters}
		/>
		<Sorting {onSortByChanged} />
	</div>
	<div
		class="mt-12 grid grid-cols-3 gap-y-18 max-[1440px]:grid-cols-2 max-[900px]:grid-cols-1 max-[900px]:place-items-center"
	>
		{#each buildings as building (building.id)}
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
