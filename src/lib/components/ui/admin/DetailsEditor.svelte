<script lang="ts">
	import Icon from '@iconify/svelte';
	import { tv } from 'tailwind-variants';
	import { BuildingType, FinishType, type BuildingDto, type FinishDto } from '$lib/types';
	import { Label, Select } from 'flowbite-svelte';
	import { getBuildingTypeName, getFinishTypeName } from '$lib/utils';
	import z from 'zod';

	let {
		savedBuilding,
		onSaveBuilding
	}: { savedBuilding?: BuildingDto | null; onSaveBuilding: (building: BuildingDto) => void } =
		$props();

	let building: BuildingDto = $state(savedBuilding || {});
	let saveError: string = $state('');
	let isSaved: boolean = $state(savedBuilding !== null);

	const lable = tv({
		variants: {
			input: {
				checkbox: 'text-dark-olive flex w-full items-center gap-1.5 max-[450px]:flex-col',
				text: 'text-dark-olive flex w-full flex-col justify-between gap-1 max-[1300px]:max-w-full max-[600px]:max-w-[70%] max-[450px]:flex-col'
			}
		}
	});
	const input = tv({
		variants: {
			type: {
				text: 'text-dark-olive placeholder:text-light-olive caret-dark-olive border-light-olive focus:border-dark-brown focus:ring-dark-brown form-input w-fit rounded-2xl bg-transparent',
				checkbox:
					'text-dark-brown border-light-brown focus:border-dark-brown focus:ring-dark-brown bg-off-white mt-0.5 form-checkbox size-5 rounded'
			}
		}
	});

	function handleSaveBuilding(building: BuildingDto) {
		const ok = validateFields(building);
		if (!ok) return;

		onSaveBuilding(building);

		isSaved = true;
	}

	function handleEdit() {
		isSaved = false;
	}

	function validateFields(building: BuildingDto): boolean {
		if (!building.name) {
			const input = document.getElementById('name') as HTMLInputElement;
			input.classList.add('border-red-500');
			input.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return false;
		}
		if (!building.length) {
			const input = document.getElementById('length') as HTMLInputElement;
			input.classList.add('border-red-500');
			input.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return false;
		}
		if (!building.width) {
			const input = document.getElementById('width') as HTMLInputElement;
			input.classList.add('border-red-500');
			input.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return false;
		}
		if (!building.bathrooms) {
			const input = document.getElementById('bathrooms') as HTMLInputElement;
			input.classList.add('border-red-500');
			input.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return false;
		}
		if (!building.bedrooms) {
			const input = document.getElementById('bedrooms') as HTMLInputElement;
			input.classList.add('border-red-500');
			input.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return false;
		}
		if (!building.floors) {
			const input = document.getElementById('floors') as HTMLInputElement;
			input.classList.add('border-red-500');
			input.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return false;
		}

		return true;
	}
</script>

<div class="flex flex-col justify-center max-[1300px]:items-center">
	{#if !isSaved}
		<input
			class="text-dark-olive placeholder:text-light-olive border-light-olive caret-dark-olive focus:border-dark-brown focus:ring-dark-brown form-input rounded-2xl bg-transparent text-2xl font-medium max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-xl"
			placeholder="Название"
			name="name"
			id="name"
			bind:value={building.name}
			required
			autocomplete="off"
		/>
		<div class="relative flex max-w-max flex-col">
			<label
				for="type"
				class="text-dark-olive mt-7 text-2xl font-medium max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-xl"
				>Тип сроения</label
			>
			<select
				class="text-dark-olive mt-4 form-multiselect rounded-2xl bg-transparent pr-8"
				id="type"
				name="type"
				bind:value={building.type}
				autocomplete="off"
				required
			>
				<option value={BuildingType.FRAME}>Каркасный дом</option>
				<option value={BuildingType.BARN}>Барнхаус</option>
				<option value={BuildingType.CONTAINER}>Бытовка</option>
			</select>
		</div>

		<div class="border-light-olive bg-light-olive mt-4 h-px w-40 border"></div>
		<h4 class="text-dark-olive mt-6 text-3xl max-[600px]:text-2xl">Паспорт объекта</h4>

		<div class="mt-6 grid grid-cols-2 place-items-start gap-5 max-[600px]:grid-cols-1">
			<div class="flex flex-col gap-2">
				<p class="max-[600px]:text-md flex gap-1 text-lg">
					<Icon icon="radix-icons:dimensions" class="size-8 min-w-6" />Габариты
				</p>
				<lable class={lable({ input: 'text' })}>
					<input
						type="number"
						name="length"
						id="length"
						placeholder="Длина"
						class={input({ type: 'text' })}
						bind:value={building.length}
						required
						autocomplete="off"
					/>
				</lable>
				<lable class={lable({ input: 'text' })}>
					<input
						type="number"
						name="width"
						id="width"
						placeholder="Ширина"
						class={input({ type: 'text' })}
						bind:value={building.width}
						required
						autocomplete="off"
					/>
				</lable>
			</div>
			<lable class={lable({ input: 'text' })}>
				<p class="flex items-center gap-1">
					<Icon icon="mdi:bathroom" class="size-8 min-w-6" /><span
						class="max-[600px]:text-md text-lg">Санузлы</span
					>
				</p>
				<input
					type="number"
					name="bathrooms"
					id="bathrooms"
					placeholder="0"
					class={input({ type: 'text' })}
					bind:value={building.bathrooms}
					required
					autocomplete="off"
				/>
			</lable>
			<lable class={lable()}>
				<p class="flex items-center gap-1">
					<Icon icon="uil:bed" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
						>Комнат</span
					>
				</p>
				<input
					type="number"
					name="bedrooms"
					id="bedrooms"
					placeholder="0"
					class={input({ type: 'text' })}
					bind:value={building.bedrooms}
					required
					autocomplete="off"
				/>
			</lable>
			<lable class={lable()}>
				<p class="flex items-center gap-1">
					<Icon icon="ri:stairs-line" class="size-8 min-w-6" /><span
						class="max-[600px]:text-md text-lg">Этажность</span
					>
				</p>
				<input
					type="number"
					name="floors"
					id="floors"
					placeholder="0"
					class={input({ type: 'text' })}
					required
					bind:value={building.floors}
					autocomplete="off"
				/>
			</lable>
			<lable class={lable({ input: 'checkbox' })}>
				<p class="flex items-center gap-1">
					<Icon icon="mdi:veranda" class="size-8 min-w-6" /><span
						class="max-[600px]:text-md text-lg">Веранда:</span
					>
				</p>
				<input
					type="checkbox"
					name="veranda"
					id="veranda"
					class={input({ type: 'checkbox' })}
					bind:checked={building.veranda}
					autocomplete="off"
				/>
			</lable>
		</div>
		{#if !isSaved}
			<button
				class="bg-dark-olive text-off-white hover:bg-light-brown mt-8 w-max rounded-2xl p-2 text-lg"
				onclick={() => handleSaveBuilding(building)}>Сохранить</button
			>
		{/if}
	{:else}
		<h2
			class="text-dark-olive text-4xl font-medium max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-3xl"
		>
			{building.name || 'Untitled'}
		</h2>
		<div class="border-light-olive bg-light-olive mt-4 h-px w-40 border"></div>
		<h4 class="text-dark-olive mt-6 text-3xl max-[600px]:text-2xl">Паспорт объекта</h4>
		<div class="place-i mt-6 grid grid-cols-2 gap-2.5 gap-x-8">
			<p class="text-dark-olive flex items-center gap-1">
				<Icon icon="ix:align-object-dimensions" class="size-8 min-w-6" /><span
					class="max-[600px]:text-md text-lg"
					>Габариты: {`${building.length}x${building.width}` || 'Unknown'}</span
				>
			</p>
			<p class="text-dark-olive flex items-center gap-1">
				<Icon icon="bx:area" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
					>Площадь: {!building.length || !building.width
						? 'Unknown'
						: building.length * building.width} м<sup>2</sup></span
				>
			</p>
			<p class="text-dark-olive flex items-center gap-1">
				<Icon icon="mdi:bathroom" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
					>Санузлов: {building.bathrooms || 'Unknown'}</span
				>
			</p>

			<p class="text-dark-olive flex items-center gap-1">
				<Icon icon="uil:bed" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
					>Комнат: {building.bedrooms || 'Unknown'}</span
				>
			</p>
			<p class="text-dark-olive flex items-center gap-1">
				<Icon icon="ri:stairs-line" class="size-8 min-w-6" /><span
					class="max-[600px]:text-md text-lg">Этажность: {building.floors || 'Unknown'}</span
				>
			</p>
			<p class="text-dark-olive flex items-center gap-1">
				<Icon icon="mdi:veranda" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
					>Веранда: {building.veranda ? 'есть' : 'нет'}</span
				>
			</p>
		</div>
		{#if isSaved}
			<button
				class="bg-dark-olive text-off-white hover:bg-light-brown mt-8 w-max rounded-2xl p-2 text-lg"
				onclick={() => handleEdit()}>Редактировать</button
			>
		{/if}
	{/if}
</div>
