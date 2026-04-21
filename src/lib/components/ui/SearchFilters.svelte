<script lang="ts">
	import { FinishType } from '$lib/types';
	import { getFinishTypeName } from '$lib/utils';
	import { Drawer, AccordionItem, Accordion } from 'flowbite-svelte';

	interface Props {
		options: {
			floors: number[];
			finishTypes: FinishType[];
			sizes: string[];
		};
		filters: {
			floors: number[];
			finishTypes: FinishType[];
			sizes: string[];
			hasVeranda: boolean | null;
		};
		onFloorsChanged: (value: number) => void;
		onFinishTypesChanged: (value: FinishType) => void;
		onSizesChanged: (value: string) => void;
		onSelectChanged: (value: boolean | null) => void;
		onResetFilters: () => void;
	}

	let {
		options,
		filters,
		onFloorsChanged,
		onFinishTypesChanged,
		onSizesChanged,
		onSelectChanged,
		onResetFilters
	}: Props = $props();

	let isDrawerOpen = $state(false);

	function isSelected<T>(value: T, list: T[]) {
		const index = list.indexOf(value);
		if (index !== -1) return true;
		return false;
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
				{#each options.floors as floor, i (i)}
					<label
						><input
							type="checkbox"
							class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
							onchange={() => onFloorsChanged(floor)}
							checked={isSelected(floor, filters.floors)}
						/>
						{floor}</label
					>
				{/each}
			</div>
		</AccordionItem>
		<AccordionItem>
			{#snippet header()}<p class="text-dark-olive">Комплектация</p>{/snippet}
			<div class="flex flex-col gap-2">
				{#each options.finishTypes as type, i (i)}
					<label
						><input
							type="checkbox"
							class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
							onchange={() => onFinishTypesChanged(type)}
							checked={isSelected(type, filters.finishTypes)}
						/>
						{getFinishTypeName(type)}</label
					>
				{/each}
			</div>
		</AccordionItem>
		<AccordionItem>
			{#snippet header()}<p class="text-dark-olive">Размер</p>{/snippet}
			<div class="flex flex-col gap-2">
				{#each options.sizes as size, i (i)}
					<label
						><input
							type="checkbox"
							class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
							onchange={() => onSizesChanged(size)}
							checked={isSelected(size, filters.sizes)}
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
						value={true}
						class="text-dark-brown bg-off-white form-radio"
						checked={filters.hasVeranda === true}
						onchange={() => onSelectChanged(true)}
					/> Есть</label
				>
				<label
					><input
						type="radio"
						value={false}
						class="text-dark-brown bg-off-white form-radio"
						checked={filters.hasVeranda === false}
						onchange={() => onSelectChanged(false)}
					/> Нет</label
				>
				<label
					><input
						type="radio"
						value={null}
						class="text-dark-brown bg-off-white form-radio"
						checked={filters.hasVeranda === null}
						onchange={() => onSelectChanged(null)}
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
