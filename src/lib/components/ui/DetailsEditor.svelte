<script lang="ts">
	import Icon from '@iconify/svelte';
	import { tv } from 'tailwind-variants';
	import { BuildingType, FinishType, type BuildingDto, type FinishDto } from '$lib/types';

	let building: BuildingDto = $state({});

	const lable = tv({
		variants: {
			input: {
				checkbox: 'text-dark-olive flex w-full items-center gap-1 max-[450px]:flex-col',
				text: 'text-dark-olive flex w-full flex-col justify-between gap-1 max-[1300px]:max-w-full max-[600px]:max-w-[70%] max-[450px]:flex-col'
			}
		}
	});
	const input = tv({
		variants: {
			type: {
				text: 'text-dark-olive placeholder:text-light-olive caret-dark-olive border-light-olive focus:border-dark-brown focus:ring-dark-brown form-input w-fit rounded-2xl bg-transparent',
				checkbox:
					'text-dark-brown border-light-brown focus:border-dark-brown focus:ring-dark-brown bg-off-white form-checkbox size-5 rounded'
			}
		}
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
			<lable class={lable({ input: 'text' })}>
				<input
					type="number"
					name="length"
					id="length"
					placeholder="Длинна"
					class={input({ type: 'text' })}
					bind:value={building.length}
					required
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
				bind:value={building.bathrooms}
				required
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
			/>
		</lable>
		<lable class={lable({ input: 'checkbox' })}>
			<p class="flex items-center gap-1">
				<Icon icon="mdi:veranda" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
					>Веранда</span
				>
			</p>
			<input
				type="checkbox"
				name="veranda"
				id="veranda"
				class={input({ type: 'checkbox' })}
				bind:checked={building.veranda}
			/>
		</lable>
	</div>
</div>
