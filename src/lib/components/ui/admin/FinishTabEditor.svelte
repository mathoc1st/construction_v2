<script lang="ts">
	import { FinishType, type FinishDto, type FinishOption, type FinishOptionDto } from '$lib/types';
	import { getFinishTypeName, getTabIcon } from '$lib/utils';
	import Icon from '@iconify/svelte';

	import { TabItem, Tooltip } from 'flowbite-svelte';
	import { tv } from 'tailwind-variants';

	let {
		onAddOption,
		onDeleteOption,
		onDeleteFinish,
		onPriceChange,
		options,
		price,
		finishType,
		isOpen = false
	}: {
		onAddOption: (finishType: FinishType, option: FinishOptionDto) => void;
		onDeleteOption: (finishType: FinishType, index: number) => void;
		onDeleteFinish: (finishType: FinishType) => void;
		onPriceChange: (finishType: FinishType, price: number) => void;
		options: FinishOptionDto[] | undefined;
		price: number | undefined;
		finishType: FinishType;
		isOpen?: boolean;
	} = $props();

	const inputText = tv({
		base: 'text-dark-olive placeholder:text-light-olive caret-dark-olive border-light-olive focus:border-dark-brown focus:ring-dark-brown form-input w-fit rounded-2xl bg-transparent'
	});

	let isOptionAvailable: boolean = $state(false);
	let optionDescription: string = $state('');

	function handleAddOption(finishType: FinishType) {
		if (optionDescription.length === 0) return;

		onAddOption(finishType, { isAvailable: isOptionAvailable, description: optionDescription });

		isOptionAvailable = false;
		optionDescription = '';
	}

	function handleDeleteOption(finishType: FinishType, index: number) {
		onDeleteOption(finishType, index);
	}

	function handleDeleteFinish(finishType: FinishType) {
		onDeleteFinish(finishType);
	}

	function handlePriceChange(event: Event, finishType: FinishType) {
		const input = event.target as HTMLInputElement;

		onPriceChange(finishType, input.valueAsNumber);
	}
</script>

<TabItem
	open={isOpen}
	key={finishType}
	class="w-full"
	classes={{
		button:
			'w-full p-4 flex justify-start max-[600px]:justify-center hover:bg-dark-olive hover:text-off-white rounded-t-2xl'
	}}
	inactiveClass="text-dark-olive"
	activeClass="w-full h-full text-off-white bg-light-brown"
>
	{#snippet titleSlot()}
		<Icon icon={getTabIcon(finishType)} class="size-8 shrink-0" />
		<p class="  text-lg">
			{getFinishTypeName(finishType)}
		</p>
	{/snippet}

	<div class="flex flex-col items-start gap-4">
		<button
			onclick={() => handleDeleteFinish(finishType)}
			type="button"
			class="bg-light-brown text-off-white flex items-center gap-1 rounded-2xl p-2"
			>Удалить<Icon icon="tabler:trash" class="size-5" /></button
		>
		<div class="flex flex-col gap-4 max-[1300px]:items-center">
			<lable class="flex w-max flex-col rounded-2xl text-xl font-medium"
				>Цена<input
					type="number"
					name="price"
					id="price"
					value={price}
					class={inputText()}
					autocomplete="off"
					onchange={(e) => {
						handlePriceChange(e, finishType);
					}}
				/></lable
			>
		</div>
		<h4 class="mt-6 flex w-max flex-col rounded-2xl text-xl font-medium">Описание</h4>
		<div class="flex flex-col gap-2">
			{#each options as option, i (i)}
				<lable class="flex items-start gap-2 text-lg">
					<Icon
						icon={option.isAvailable
							? 'ic:round-check-circle-outline'
							: 'material-symbols:cancel-outline-rounded'}
						class="mt-1 size-6 shrink-0 {option.isAvailable
							? 'text-dark-brown'
							: 'text-light-olive'}"
					/>
					<p class="max-w-[300px]">{option.description}</p>
					<button
						type="button"
						onclick={() => {
							handleDeleteOption(finishType, i);
						}}
						class="hover:text-dark-brown transition"
						><Icon icon="tabler:trash" class="size-8 pb-1" /></button
					>
				</lable>
			{/each}
		</div>

		<div class="flex w-full flex-col gap-4">
			<label class="text-dark-olive flex gap-4">
				<span class="text-lg">Есть:</span>
				<fieldset id="veranda" name="veranda" class="flex gap-2">
					<label
						for="
					"
						class="text-dark-olive flex items-center gap-1"
						>Да<input
							type="radio"
							name="veranda"
							onchange={() => {
								isOptionAvailable = true;
							}}
							autocomplete="off"
							class="text-dark-brown bg-off-white form-radia"
						/></label
					>

					<label class="text-dark-olive flex items-center gap-1"
						>Нет<input
							checked
							type="radio"
							name="veranda"
							onchange={() => {
								isOptionAvailable = false;
							}}
							autocomplete="off"
							class="text-dark-brown bg-off-white form-radia"
						/></label
					>
				</fieldset>
			</label>
			<label class="flex items-center gap-2">
				<textarea
					name="option"
					rows="5"
					bind:value={optionDescription}
					class={[inputText(), 'resize-none']}
					autocomplete="off"
				></textarea>

				<button
					type="button"
					onclick={() => {
						handleAddOption(finishType);
					}}
					class="bg-light-brown text-off-white hover:bg-dark-olive h-max w-max rounded-full p-1"
					><Icon icon="gg:add" class="size-6" /></button
				>
				<Tooltip class="bg-dark-olive text-off-white">Добавить описание</Tooltip>
			</label>
		</div>
	</div>
</TabItem>
