<script lang="ts">
	import Icon from '@iconify/svelte';

	import { Tabs } from 'flowbite-svelte';
	import { tv } from 'tailwind-variants';
	import AddFinishTabItem from './FinishTabEditor.svelte';
	import { BuildingType, FinishType, type BuildingDto, type FinishDto } from '$lib/types';
	import { getFinishTypeName } from '$lib/utils';

	let {
		finishes = $bindable(),
		building = $bindable()
	}: {
		finishes: FinishDto[];
		building: BuildingDto;
	} = $props();

	let selectedFinish = $state(FinishType.COLD);

	const inputLable = tv({
		base: 'text-dark-olive flex w-full flex-col justify-between gap-1 max-[1300px]:max-w-full max-[600px]:max-w-[70%] max-[450px]:flex-col'
	});
	const checkBoxLable = tv({
		base: 'text-dark-olive flex w-full items-center gap-1 max-[450px]:flex-col'
	});
	const inputText = tv({
		base: 'text-dark-olive placeholder:text-light-olive caret-dark-olive border-light-olive focus:border-dark-brown focus:ring-dark-brown form-input w-fit rounded-2xl bg-transparent'
	});
	const inputCheckbox = tv({
		base: 'text-dark-brown border-light-brown focus:border-dark-brown focus:ring-dark-brown bg-off-white form-checkbox size-5 rounded'
	});
</script>

<div class="flex flex-col justify-center max-[1300px]:items-center">
	<input
		class="text-dark-olive placeholder:text-light-olive border-light-olive caret-dark-olive focus:border-dark-brown focus:ring-dark-brown form-input rounded-2xl bg-transparent text-2xl font-medium max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-xl"
		placeholder="Название"
		name="name"
		bind:value={building.name}
		required
	/>
	<div class="relative flex max-w-max flex-col">
		<label
			for="type"
			class="text-dark-olive mt-7 text-2xl font-medium max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-xl"
			>Тип сроения</label
		>
		<select
			class="text-dark-olive rounded-2xl bg-transparent"
			id="type"
			name="type"
			bind:value={building.type}
			required
		>
			<option value={BuildingType.FRAME}>Каркасный дом</option>
			<option value={BuildingType.BARN}>Барнхаус</option>
			<option value={BuildingType.CONTAINER}>Бытовка</option>
		</select>
	</div>

	<div class="border-light-olive bg-light-olive mt-4 h-px w-40 border"></div>
	<h4 class="text-dark-olive mt-6 text-3xl max-[600px]:text-2xl">Паспорт объекта</h4>

	<div class="mt-6 flex max-w-max flex-col gap-5">
		<div class="flex flex-col gap-2">
			<p class="max-[600px]:text-md flex gap-1 text-lg">
				<Icon icon="radix-icons:dimensions" class="size-8 min-w-6" />Габариты
			</p>
			<lable class={inputLable()}>
				<input
					type="number"
					name="length"
					id="length"
					placeholder="Длинна"
					class={inputText()}
					bind:value={building.length}
					required
				/>
			</lable>
			<lable class={inputLable()}>
				<input
					type="number"
					name="width"
					id="width"
					placeholder="Ширина"
					class={inputText()}
					bind:value={building.width}
					required
				/>
			</lable>
		</div>
		<lable class={inputLable()}>
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
				class={inputText()}
				bind:value={building.bathrooms}
				required
			/>
		</lable>
		<lable class={inputLable()}>
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
				class={inputText()}
				bind:value={building.bedrooms}
				required
			/>
		</lable>
		<lable class={inputLable()}>
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
				class={inputText()}
				required
				bind:value={building.floors}
			/>
		</lable>
		<lable class={checkBoxLable()}>
			<p class="flex items-center gap-1">
				<Icon icon="mdi:veranda" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
					>Веранда</span
				>
			</p>
			<input
				type="checkbox"
				name="veranda"
				id="veranda"
				class={inputCheckbox()}
				bind:checked={building.veranda}
			/>
		</lable>
	</div>

	<div class="relative mt-4 flex max-w-max flex-col">
		<label
			for="finish"
			class="text-dark-olive mt-7 text-2xl font-medium max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-xl"
			>Комплектация</label
		>
		<select
			class="text-dark-olive mt-4 rounded-2xl bg-transparent"
			id="type"
			name="type"
			bind:value={selectedFinish}
			required
		>
			{#each Object.values(FinishType) as finishType}
				<option disabled={finishes.some((f) => f.type === finishType)} value={finishType}
					>{getFinishTypeName(finishType)}</option
				>
			{/each}
		</select>

		<button
			type="button"
			onclick={() => {
				if (!finishes.some((f) => f.type === selectedFinish))
					finishes.push({ type: selectedFinish });
			}}
			class="bg-dark-olive text-off-white hover:bg-light-brown mt-4 h-max w-max rounded-2xl px-4 py-2 text-lg"
			>Добавить</button
		>
	</div>

	{#if finishes && finishes.length > 0}
		<Tabs
			class="mt-8"
			tabStyle="underline"
			classes={{
				active: 'bg-light-brown max-[650px]:w-full border-light-olive',
				divider: 'bg-light-olive'
			}}
			ulClass="max-[650px]:flex-col max-[650px]:w-full flex-wrap "
		>
			{#each finishes, i}
				<AddFinishTabItem isOpen={i === 0} />
			{/each}
		</Tabs>
	{/if}
</div>
