<script lang="ts">
	import { FinishType } from '$lib/types';
	import { getFinishTypeName } from '$lib/utils';
	import type { Snapshot } from '@sveltejs/kit';
	import { Drawer, AccordionItem, Accordion } from 'flowbite-svelte';

	let isDrawerOpen = $state(false);

	let floors: number[] = $state([]);
	let finishes: FinishType[] = $state([]);
	let sizes: string[] = $state([]);
	let veranda: boolean | null = $state(null);

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
		onToggle(event, floor, floors);
	}

	function onFinishesChanged(event: Event, finish: FinishType) {
		onToggle(event, finish, finishes);
	}

	function onSizesChanged(event: Event, size: string) {
		onToggle(event, size, sizes);
	}

	function onResetFilters() {
		floors = [];
		finishes = [];
		sizes = [];
		veranda = null;
	}

	export const snapshot: Snapshot<{
		floors: number[];
		finishes: FinishType[];
		sizes: string[];
		veranda: boolean | null;
	}> = {
		capture: () => ({ floors, finishes, sizes, veranda }),
		restore: (value) => {
			floors = value.floors;
			finishes = value.finishes;
			sizes = value.sizes;
			veranda = value.veranda;
		}
	};

	$inspect(floors);
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
				<label
					><input
						type="checkbox"
						class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
						onchange={(e) => onFloorsChanged(e, 1)}
						checked={isSelected(1, floors)}
					/>
					1</label
				>
				<label
					><input
						type="checkbox"
						class="text-dark-brown border-light-brown bg-off-white form-checkbox rounded"
						onchange={(e) => onFloorsChanged(e, 2)}
						checked={isSelected(2, floors)}
					/>
					2</label
				>
				<label
					><input
						type="checkbox"
						class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
						onchange={(e) => onFloorsChanged(e, 3)}
						checked={isSelected(3, floors)}
					/>
					3</label
				>
			</div>
		</AccordionItem>
		<AccordionItem>
			{#snippet header()}<p class="text-dark-olive">Комплектация</p>{/snippet}
			<div class="flex flex-col gap-2">
				<label
					><input
						type="checkbox"
						class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
						onchange={(e) => onFinishesChanged(e, FinishType.COLD)}
						checked={isSelected(FinishType.COLD, finishes)}
					/>
					{getFinishTypeName(FinishType.COLD)}</label
				>
				<label
					><input
						type="checkbox"
						class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
						onchange={(e) => onFinishesChanged(e, FinishType.WARM)}
						checked={isSelected(FinishType.WARM, finishes)}
					/>
					{getFinishTypeName(FinishType.WARM)}</label
				>
				<label
					><input
						type="checkbox"
						class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
						onchange={(e) => onFinishesChanged(e, FinishType.ALL_YEAR)}
						checked={isSelected(FinishType.ALL_YEAR, finishes)}
					/>
					{getFinishTypeName(FinishType.ALL_YEAR)}</label
				>
			</div>
		</AccordionItem>
		<AccordionItem>
			{#snippet header()}<p class="text-dark-olive">Размер</p>{/snippet}
			<div class="flex flex-col gap-2">
				<label
					><input
						type="checkbox"
						class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
						onchange={(e) => onSizesChanged(e, '5x4')}
						checked={isSelected('5x4', sizes)}
					/> 5х4</label
				>
				<label
					><input
						type="checkbox"
						class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
						onchange={(e) => onSizesChanged(e, '5x3')}
						checked={isSelected('5x3', sizes)}
					/> 5х3</label
				>
				<label
					><input
						type="checkbox"
						class="text-dark-brown bg-off-white border-light-brown form-checkbox rounded"
						onchange={(e) => onSizesChanged(e, '4x3')}
						checked={isSelected('4x3', sizes)}
					/> 4х3</label
				>
			</div>
		</AccordionItem>
		<AccordionItem>
			{#snippet header()}<p class="text-dark-olive">Веранда</p>{/snippet}
			<div class="flex flex-col gap-2">
				<label
					><input
						type="radio"
						bind:group={veranda}
						value={true}
						class="text-dark-brown bg-off-white form-radia"
						checked={veranda === true}
					/> Есть</label
				>
				<label
					><input
						type="radio"
						bind:group={veranda}
						value={false}
						class="text-dark-brown bg-off-white form-radia"
						checked={veranda === false}
					/> Нет</label
				>
				<label
					><input
						type="radio"
						bind:group={veranda}
						value={null}
						class="text-dark-brown bg-off-white form-radia"
						checked={veranda === null}
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
