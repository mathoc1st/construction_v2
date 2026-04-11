<script lang="ts">
	import BuildingCard from '$lib/components/ui/BuildingCard.svelte';
	import SearchFilters from '$lib/components/ui/SearchFilters.svelte';
	import Sorting from '$lib/components/ui/Sorting.svelte';
	import { PaginationNav } from 'flowbite-svelte';
	import type { PageProps, Snapshot } from './$types';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { FinishType } from '$lib/types/finishes/finish.domain.types';
	import { getBuildingTypeName } from '$lib/utils';
	import { ConstructionType } from '$lib/types/buildings/building.domain.types';
	import { type SortOptionsV2 } from '$lib/types/listings/listings.repository.types';
	import type { ListingDto } from '$lib/dtos/listing.dto';

	let { data, params }: PageProps = $props();

	let limit = 12;
	let listings = $derived(data.listings);
	let currentPage = $state(1);
	let innerWidth = $state(0);
	let visiblePages = $derived.by(() => {
		if (innerWidth < 600) return 3;
		return 5;
	});

	let totalPages = $derived(data.total ? Math.ceil(data.total / limit) : 0);

	async function handlePageChange(page: number) {
		if (page === currentPage) return;
		currentPage = page;
		await refetch();
	}

	async function refetch() {
		const urlParams = new SvelteURLSearchParams();

		urlParams.append('sortBy', JSON.stringify(sortByFilter));
		urlParams.append('limit', limit.toString());
		urlParams.append('page', currentPage.toString());
		urlParams.append('constructionType', params.type);
		selectedFloors.forEach((f) => {
			urlParams.append('floors', f.toString());
		});
		selectedFinishes.forEach((f) => {
			urlParams.append('finishTypes', f);
		});
		selectedSizes.forEach((s) => {
			urlParams.append('dimensions', JSON.stringify(s));
		});
		if (isVerandaSelected !== null) urlParams.append('veranda', JSON.stringify(isVerandaSelected));

		const response = await fetch(`/api/buildings?${urlParams}`, { method: 'GET' });

		if (!response.ok) return;

		const result = (await response.json()) as {
			listings: ListingDto[];
			total: number;
		};

		if (!result) {
			return;
		}

		listings = result.listings;
		totalPages = Math.ceil(result.total / limit);

		setTimeout(() => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}, 50);
	}

	let selectedFloors: number[] = $state([]);
	let selectedFinishes: FinishType[] = $state([]);
	let selectedSizes: { width: number; length: number }[] = $state([]);
	let isVerandaSelected: boolean | null = $state(null);
	let sortByFilter: SortOptionsV2 = $state({
		views: 'desc'
	});

	async function onFloorsChanged(floor: number) {
		if (selectedFloors.includes(floor)) {
			selectedFloors = selectedFloors.filter((f) => f !== floor);
		} else {
			selectedFloors = [...selectedFloors, floor];
		}
		await refetch();
	}

	async function onFinishesChanged(finish: FinishType) {
		if (selectedFinishes.includes(finish)) {
			selectedFinishes = selectedFinishes.filter((f) => f !== finish);
		} else {
			selectedFinishes = [...selectedFinishes, finish];
		}
		await refetch();
	}

	async function onSizesChanged(size: { width: number; length: number }) {
		if (selectedSizes.some((s) => s.width === size.width && s.length === size.length)) {
			selectedSizes = selectedSizes.filter(
				(s) => !(s.width === size.width && s.length === size.length)
			);
		} else {
			selectedSizes = [...selectedSizes, size];
		}
		await refetch();
	}

	async function onVerandaChanged(veranda: boolean | null) {
		if (isVerandaSelected === veranda) {
			isVerandaSelected = null;
		} else {
			isVerandaSelected = veranda;
		}
		await refetch();
	}

	async function onResetFilters() {
		selectedFloors = [];
		selectedFinishes = [];
		selectedSizes = [];
		isVerandaSelected = null;
		await refetch();
	}

	async function onSortByChanged(sort: 'views' | 'price') {
		if (sortByFilter[sort] === 'asc') {
			sortByFilter = { [sort]: 'desc' };
		} else {
			sortByFilter = { [sort]: 'asc' };
		}
		await refetch();
	}

	export const snapshot: Snapshot<{
		currentPage: number;
		floors: number[];
		finishes: FinishType[];
		sizes: { width: number; length: number }[];
		veranda: boolean | null;
	}> = {
		capture: () => ({
			currentPage,
			floors: selectedFloors,
			finishes: selectedFinishes,
			sizes: selectedSizes,
			veranda: isVerandaSelected
		}),
		restore: async (value) => {
			currentPage = value.currentPage;
			selectedFloors = value.floors;
			selectedFinishes = value.finishes;
			selectedSizes = value.sizes;
			isVerandaSelected = value.veranda;

			await refetch();
		}
	};
</script>

<svelte:window bind:innerWidth />
<section class="mx-auto mt-26 mb-26 max-w-[1440px] px-5">
	<h1 class="text-center text-5xl font-medium max-[600px]:text-4xl">
		{getBuildingTypeName(params.type.toUpperCase() as ConstructionType)}
	</h1>
	<div class="mt-26 flex w-full gap-4 max-[900px]:justify-center">
		<SearchFilters
			details={data.details}
			{selectedFloors}
			{selectedFinishes}
			{selectedSizes}
			{isVerandaSelected}
			{onFloorsChanged}
			{onFinishesChanged}
			{onSizesChanged}
			{onVerandaChanged}
			{onResetFilters}
		/>
		<!-- <Sorting sortBy={sortByFilter} {onSortByChanged} /> -->
	</div>
	<div
		class="mt-12 grid grid-cols-3 gap-y-18 max-[1440px]:grid-cols-2 max-[900px]:grid-cols-1 max-[900px]:place-items-center"
	>
		{#each listings as listing (listing.id)}
			<BuildingCard {listing} />
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
