<script lang="ts">
	import BuildingCard from '$lib/components/ui/BuildingCard.svelte';
	import SearchFilters from '$lib/components/ui/SearchFilters.svelte';
	import Sorting from '$lib/components/ui/Sorting.svelte';
	import type { Snapshot } from '@sveltejs/kit';
	import { PaginationNav } from 'flowbite-svelte';
	import type { PageProps } from './$types';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { FinishType } from '$lib/types/finishes/finish.domain.types';
	import { getBuildingTypeName } from '$lib/utils';
	import { ConstructionType } from '$lib/types/buildings/building.domain.types';
	import { SortDirection } from '$lib/types/prisma/prisma.service.types';
	import {
		ListingSortableFields,
		type SortOptionsUnion
	} from '$lib/types/listings/listings.repository.types';
	import type { ListingDto } from '$lib/dtos/listing.dto';

	let { data, params }: PageProps = $props();

	let listings = $derived(data.listings);
	let currentPage = $state(1);
	let innerWidth = $state(0);
	let visiblePages = $derived.by(() => {
		if (innerWidth < 600) return 3;
		return 5;
	});

	let totalPages = $derived(Math.ceil(data.total / 12));

	async function handlePageChange(page: number) {
		currentPage = page;
		refetch();
	}

	async function refetch() {
		const urlParams = new SvelteURLSearchParams();
		urlParams.append('page', currentPage.toString());
		urlParams.append('type', params.type);
		urlParams.append('sortType', sortByFilter.type);
		urlParams.append('sortField', sortByFilter.sort?.field ? sortByFilter.sort.field : '');
		urlParams.append(
			'sortDirection',
			sortByFilter.sort?.direction ? sortByFilter.sort.direction : ''
		);
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

		const response = await fetch(`/api/buildings?${urlParams}`, { method: 'GET' });

		if (!response.ok) return;

		const result = (await response.json()) as ListingDto[];

		if (!result) {
			return;
		}

		listings = result;
		totalPages = Math.ceil(result.length / 12);

		setTimeout(() => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth' // scrolls smoothly
			});
		}, 50);
	}

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		floorsFilter;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		finishesFilter;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		sizesFilter;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		sortByFilter;
		refetch();
	});

	let floorsFilter: number[] = $state([]);
	let finishesFilter: FinishType[] = $state([]);
	let sizesFilter: string[] = $state([]);
	let verandaFilter: boolean | null = $state(null);
	let sortByFilter: SortOptionsUnion = $state({
		type: 'listing',
		sort: {
			field: ListingSortableFields.VIEWS,
			direction: SortDirection.DESC
		}
	});

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
		{getBuildingTypeName(params.type.toUpperCase() as ConstructionType)}
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
