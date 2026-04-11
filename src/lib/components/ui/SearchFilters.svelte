<script lang="ts">
	import type { FinishType } from '$lib/types/finishes/finish.domain.types';
	import type { AllBuildingDetails } from '$lib/types/listings/listings.repository.types';
	import { getFinishTypeName } from '$lib/utils';
	import { Drawer, AccordionItem, Accordion } from 'flowbite-svelte';

	interface Props {
		details: AllBuildingDetails | undefined;
		selectedFloors: number[];
		selectedFinishes: FinishType[];
		selectedSizes: { width: number; length: number }[];
		isVerandaSelected: boolean | null;
		onFloorsChanged: (floor: number) => void;
		onFinishesChanged: (finish: FinishType) => void;
		onSizesChanged: (size: { width: number; length: number }) => void;
		onVerandaChanged: (veranda: boolean | null) => void;
		onResetFilters: () => void;
	}

	let {
		details,
		selectedFloors,
		selectedFinishes,
		selectedSizes,
		isVerandaSelected,
		onFloorsChanged,
		onFinishesChanged,
		onSizesChanged,
		onVerandaChanged,
		onResetFilters
	}: Props = $props();

	let isDrawerOpen = $state(false);
	let floors = $derived(details?.floors.sort((a, b) => a - b));
	let finishes = $derived(details?.finishTypes);
	let sizes = $derived(
		details?.dimensions.sort((a, b) => {
			if (a.width !== b.width) {
				return a.width - b.width;
			}
			return a.length - b.length;
		})
	);

	function isSelected<T>(value: T, list: T[]) {
		const index = list.indexOf(value);
		if (index !== -1) return true;
		return false;
	}

	function isSelectedSize(
		value: { width: number; length: number },
		list: { width: number; length: number }[]
	) {
		return list.some((v) => v.width === value.width && v.length === value.length);
	}
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
							onchange={() => onFloorsChanged(floor)}
							checked={isSelected(floor, selectedFloors)}
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
							onchange={() => onFinishesChanged(finish)}
							checked={isSelected(finish, selectedFinishes)}
						/>
						{getFinishTypeName(finish)}</label
					>
				{/each}
			</div>
		</AccordionItem>
		<AccordionItem>
			{#snippet header()}<p class="text-dark-olive">Размер</p>{/snippet}
			<div class="flex flex-col gap-2">
				{#each sizes as size (size.width + 'x' + size.length)}
					<label
						><input
							type="checkbox"
							class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
							onchange={() => onSizesChanged(size)}
							checked={isSelectedSize(size, selectedSizes)}
						/>
						{size.width}x{size.length}</label
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
						bind:group={isVerandaSelected}
						value={true}
						class="text-dark-brown bg-off-white form-radia"
						checked={isVerandaSelected === true}
						onclick={() => onVerandaChanged(true)}
					/> Есть</label
				>
				<label
					><input
						type="radio"
						bind:group={isVerandaSelected}
						value={false}
						class="text-dark-brown bg-off-white form-radia"
						checked={isVerandaSelected === false}
						onclick={() => onVerandaChanged(false)}
					/> Нет</label
				>
				<label
					><input
						type="radio"
						bind:group={isVerandaSelected}
						value={null}
						class="text-dark-brown bg-off-white form-radia"
						checked={isVerandaSelected === null}
						onclick={() => onVerandaChanged(null)}
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
