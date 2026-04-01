<script lang="ts">
	import { ConstructionType, OutsideFinish } from '$lib/server/api/buildings/building.domain';
	import type { BuildingDto } from '$lib/server/api/buildings/building.dto';
	import Icon from '@iconify/svelte';
	import { tv } from 'tailwind-variants';
	import { Textarea } from 'flowbite-svelte';

	interface Props {
		listing?: ListingDto | null;
		building?: BuildingDto | null;
		onSaveBuilding: (building: BuildingDto) => void;
	}

	let { listing, building, onSaveBuilding }: Props = $props();

	let name = $state(listing?.name ?? 'Название');
	let constructionType = $state(building?.constructionType ?? ConstructionType.FRAME);
	let length = $state(building?.length ?? 0);
	let width = $state(building?.width ?? 0);
	let bathrooms = $state(building?.bathrooms ?? 0);
	let bedrooms = $state(building?.bedrooms ?? 0);
	let floors = $state(building?.floors ?? 0);
	let veranda = $state(building?.veranda ?? false);

	let saveError: string = $state('');
	let isSaved: boolean = $state(building !== null);
	let selectedFinish: OutsideFinish = $state(OutsideFinish.COLD);

	let outsideFinishes: Record<OutsideFinish, string> = $state({
		[OutsideFinish.COLD]: '',
		[OutsideFinish.WARM_100]: '',
		[OutsideFinish.WARM_150]: '',
		[OutsideFinish.WARM_200]: ''
	});

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

	function getFinishTypeName(type: OutsideFinish): string {
		switch (type) {
			case OutsideFinish.COLD:
				return 'Холодный контур';
			case OutsideFinish.WARM_100:
				return 'Теплый контур 100мм';
			case OutsideFinish.WARM_150:
				return 'Теплый контур 150мм';
			case OutsideFinish.WARM_200:
				return 'Теплый контур 200мм';
		}
	}

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

<form class="flex flex-col justify-center max-[1300px]:items-center">
	<input
		class="text-dark-olive placeholder:text-light-olive border-light-olive caret-dark-olive focus:border-dark-brown focus:ring-dark-brown form-input rounded-2xl bg-transparent text-2xl font-medium max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-xl"
		placeholder="Название"
		name="name"
		id="name"
		bind:value={name}
		required
		autocomplete="off"
	/>

	<div class="border-light-olive bg-light-olive mt-4 h-px w-40 border"></div>

	<h4 class="text-dark-olive mt-6 text-3xl max-[600px]:text-2xl">Паспорт объекта</h4>

	<div class="relative mb-4 flex max-w-max flex-col">
		<label
			for="type"
			class="text-dark-olive mt-7 text-2xl font-normal max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-xl"
			>Тип сроения</label
		>
		<select
			class="text-dark-olive mt-4 form-multiselect rounded-2xl bg-transparent pr-8"
			id="type"
			name="type"
			bind:value={constructionType}
			autocomplete="off"
			required
		>
			<option value={ConstructionType.FRAME}>Каркасный дом</option>
			<option value={ConstructionType.BARN}>Барнхаус</option>
			<option value={ConstructionType.CONTAINER}>Бытовка</option>
		</select>
	</div>

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
					bind:value={length}
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
					bind:value={width}
					required
					autocomplete="off"
				/>
			</lable>
		</div>
		<lable class={lable({ input: 'text' })}>
			<p class="flex items-center gap-1">
				<Icon icon="mdi:bathroom" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
					>Санузлы</span
				>
			</p>
			<input
				type="number"
				name="bathrooms"
				id="bathrooms"
				placeholder="0"
				class={input({ type: 'text' })}
				bind:value={bathrooms}
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
				bind:value={bedrooms}
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
				bind:value={floors}
				autocomplete="off"
			/>
		</lable>
		<lable class={lable({ input: 'checkbox' })}>
			<p class="flex items-center gap-1">
				<Icon icon="mdi:veranda" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
					>Веранда:</span
				>
			</p>
			<input
				type="checkbox"
				name="veranda"
				id="veranda"
				class={input({ type: 'checkbox' })}
				bind:checked={veranda}
				autocomplete="off"
			/>
		</lable>
	</div>
	<label
		for="finish"
		class="text-dark-olive mt-7 text-2xl font-medium max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-xl"
		>Комплектация</label
	>
	<select
		class="text-dark-olive mt-4 rounded-2xl bg-transparent disabled:cursor-not-allowed!"
		id="finish"
		name="finish"
		bind:value={selectedFinish}
		required
	>
		{#each Object.values(OutsideFinish) as finishType (finishType)}
			<option value={finishType}>{getFinishTypeName(finishType)}</option>
		{/each}
	</select>
	<Textarea bind:value={outsideFinishes[selectedFinish]}></Textarea>

	<button
		class="bg-dark-olive text-off-white hover:bg-light-brown mt-8 w-max rounded-2xl p-2 text-lg"
		onclick={() => handleSaveBuilding(building)}>Сохранить</button
	>
</form>
