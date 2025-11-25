<script lang="ts">
	import type { getBuildingDetailsByType } from '$lib/server/db/queries/building';
	import { FinishType, type Building, type Finish } from '$lib/types';
	import { getFinishTypeName } from '$lib/utils';
	import type { Snapshot } from '@sveltejs/kit';
	import { Drawer, AccordionItem, Accordion } from 'flowbite-svelte';

	let {
		details,
		floorsFilter = $bindable(),
		finishesFilter = $bindable(),
		sizesFilter = $bindable(),
		verandaFilter = $bindable()
	}: {
		details: Awaited<ReturnType<typeof getBuildingDetailsByType>>;
		floorsFilter: number[];
		finishesFilter: FinishType[];
		sizesFilter: string[];
		verandaFilter: boolean | null;
	} = $props();

	let isDrawerOpen = $state(false);
	let floors = $derived([
		...new Set(
			details.map((b) => {
				return b.floors;
			})
		)
	]);

	let finishes = $derived.by(() => {
		const foundFinishes: FinishType[] = [];
		for (const detail of details) {
			for (const finish of detail.finishes) {
				foundFinishes.push(finish.type);
			}
		}

		return [...new Set(foundFinishes)];
	});

	let sizes = $derived([
		...new Set(
			details.map((b) => {
				return b.size;
			})
		)
	]);

	function onToggle<T>(event: Event, value: T, list: T[]) {
		const checkbox = event.target as HTMLInputElement;

		if (!checkbox.checked) {
			const index = list.indexOf(value);
			if (index !== -1) list.splice(index, 1);
			return;
		}

		list.push(value);
	}

	function isSelected<T>(value: T, list: T[]) {
		const index = list.indexOf(value);
		if (index !== -1) return true;
		return false;
	}

	function onFloorsChanged(event: Event, floor: number) {
		onToggle(event, floor, floorsFilter);
	}

	function onFinishesChanged(event: Event, finish: FinishType) {
		onToggle(event, finish, finishesFilter);
	}

	function onSizesChanged(event: Event, size: string) {
		onToggle(event, size, sizesFilter);
	}

	function onResetFilters() {
		floorsFilter = [];
		finishesFilter = [];
		sizesFilter = [];
		verandaFilter = null;
	}

	export const snapshot: Snapshot<{
		floors: number[];
		finishes: FinishType[];
		sizes: string[];
		veranda: boolean | null;
	}> = {
		capture: () => ({
			floors: floorsFilter,
			finishes: finishesFilter,
			sizes: sizesFilter,
			veranda: verandaFilter
		}),
		restore: (value) => {
			floorsFilter = value.floors;
			finishesFilter = value.finishes;
			sizesFilter = value.sizes;
			verandaFilter = value.veranda;
		}
	};
</script>

<button
	onclick={() => {
		isDrawerOpen = true;
	}}
	class={[
		'bg-dark-olive text-off-white hover:bg-light-brown hover:text-dark-olive rounded-2xl px-6 py-2 text-xl transition',
		{ 'bg-light-brown text-dark-olive!': isDrawerOpen }
	]}>Фильтры</button
>

<Drawer bind:open={isDrawerOpen} aria-labelledby="drawer-label" class="bg-off-white">
	<h4 class="text-dark-olive text-center text-2xl max-[600px]:text-lg">Фильтры</h4>
	<Accordion
		class="border-light-olive  mt-12"
		inactiveClass="hover:bg-transparent"
		activeClass="bg-transparent"
	>
		<AccordionItem>
			{#snippet header()}<p class="text-dark-olive">Этажность</p>{/snippet}
			<div class="flex flex-col gap-2">
				{#each floors as floor, i (i)}
					<label
						><input
							type="checkbox"
							class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
							onchange={(e) => onFloorsChanged(e, floor)}
							checked={isSelected(floor, floorsFilter)}
						/>
						{floor}</label
					>
				{/each}
			</div>
		</AccordionItem>
		<AccordionItem>
			{#snippet header()}<p class="text-dark-olive">Комплектация</p>{/snippet}
			<div class="flex flex-col gap-2">
				{#each finishes as finish, i (i)}
					<label
						><input
							type="checkbox"
							class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
							onchange={(e) => onFinishesChanged(e, finish)}
							checked={isSelected(finish, finishesFilter)}
						/>
						{getFinishTypeName(finish)}</label
					>
				{/each}
			</div>
		</AccordionItem>
		<AccordionItem>
			{#snippet header()}<p class="text-dark-olive">Размер</p>{/snippet}
			<div class="flex flex-col gap-2">
				{#each sizes as size, i (i)}
					<label
						><input
							type="checkbox"
							class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
							onchange={(e) => onSizesChanged(e, size)}
							checked={isSelected(size, sizesFilter)}
						/>
						{size}</label
					>
				{/each}
			</div>
		</AccordionItem>
		<AccordionItem>
			{#snippet header()}<p class="text-dark-olive">Веранда</p>{/snippet}
			<div class="flex flex-col gap-2">
				<label
					><input
						type="radio"
						bind:group={verandaFilter}
						value={true}
						class="text-dark-brown bg-off-white form-radia"
						checked={verandaFilter === true}
					/> Есть</label
				>
				<label
					><input
						type="radio"
						bind:group={verandaFilter}
						value={false}
						class="text-dark-brown bg-off-white form-radia"
						checked={verandaFilter === false}
					/> Нет</label
				>
				<label
					><input
						type="radio"
						bind:group={verandaFilter}
						value={null}
						class="text-dark-brown bg-off-white form-radia"
						checked={verandaFilter === null}
					/> Без разницы</label
				>
			</div>
		</AccordionItem>
	</Accordion>
	<button
		onclick={onResetFilters}
		class="bg-dark-olive text-off-white hover:bg-light-brown hover:text-dark-olive mx-auto mt-8 w-max rounded-2xl px-6 py-2 text-xl transition"
		>Сбросить</button
	>
</Drawer>
