<script lang="ts">
	import { FinishType, type FinishDto, type FinishOptionDto } from '$lib/types';
	import { getFinishTypeName, getTabIcon, prettyPrice } from '$lib/utils';
	import Icon from '@iconify/svelte';

	import { TabItem, Tooltip } from 'flowbite-svelte';
	import { tv } from 'tailwind-variants';

	let {
		finish: ffinish,
		onSaveFinish,
		onDeleteFinish
	}: {
		finish: FinishDto;
		onSaveFinish: (finish: FinishDto) => void;
		onDeleteFinish: (finishType: FinishType) => void;
	} = $props();

	const inputText = tv({
		base: 'text-dark-olive placeholder:text-light-olive caret-dark-olive border-light-olive focus:border-dark-brown focus:ring-dark-brown form-input w-fit rounded-2xl bg-transparent'
	});

	let finish: FinishDto = $derived(ffinish);
	let isSaved: boolean = $state(
		ffinish !== null &&
			ffinish.options !== undefined &&
			ffinish.price !== undefined &&
			ffinish.options.length > 0
	);
	let isOptionAvailable: boolean = $state(false);
	let optionDescription: string = $state('');

	function handleAddOption() {
		if (optionDescription.length === 0) return;

		if (!finish.options) finish.options = [];

		finish.options.push({ isAvailable: isOptionAvailable, description: optionDescription });
		finish.options.sort((a, _) => {
			return a.isAvailable === false ? 1 : -1;
		});

		optionDescription = '';
	}

	function handleSaveFinish() {
		const priceInput = document.getElementById('price') as HTMLInputElement;
		const optionInput = document.getElementById('option') as HTMLInputElement;

		if ((!finish.options || finish.options.length === 0) && (!finish.price || finish.price === 0)) {
			priceInput.classList.add('border-red-500');
			optionInput.classList.add('border-red-500');
			priceInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}

		if (finish.options && finish.options.length > 0 && (!finish.price || finish.price === 0)) {
			priceInput.classList.add('border-red-500');
			priceInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}

		priceInput.classList.remove('border-red-500');

		if (finish.price && finish.price > 0 && (!finish.options || finish.options.length === 0)) {
			optionInput.classList.add('border-red-500');
			optionInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}

		optionInput.classList.remove('border-red-500');

		onSaveFinish(finish);
		isSaved = true;
	}

	function handleEditFinish() {
		isSaved = false;
	}

	function handleDeleteOption(option: FinishOptionDto) {
		if (!finish.options) return;

		finish.options = finish.options.filter((o) => o !== option);
	}

	function handleDeleteFinish(finishType: FinishType) {
		onDeleteFinish(finishType);
	}
</script>

<TabItem
	key={finish.type}
	class="w-full"
	classes={{
		button:
			'w-full p-4 flex justify-start max-[600px]:justify-center hover:bg-dark-olive hover:text-off-white rounded-t-2xl'
	}}
	inactiveClass="text-dark-olive"
	activeClass="w-full h-full text-off-white bg-light-brown"
>
	{#snippet titleSlot()}
		<Icon icon={getTabIcon(finish.type)} class="size-8 shrink-0" />
		<p class="  text-lg">
			{getFinishTypeName(finish.type)}
		</p>
	{/snippet}

	{#if !isSaved}
		<div class="flex flex-col items-start gap-4">
			<button
				onclick={() => handleDeleteFinish(finish.type)}
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
						bind:value={finish.price}
						class={inputText()}
						autocomplete="off"
					/></lable
				>
			</div>
			<h4 class="mt-6 flex w-max flex-col rounded-2xl text-xl font-medium">Описание</h4>
			<div class="flex flex-col gap-2">
				{#each finish.options as option, i (i)}
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
								handleDeleteOption(option);
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
						id="option"
						rows="5"
						bind:value={optionDescription}
						class={[inputText(), 'resize-none']}
						autocomplete="off"
					></textarea>

					<button
						type="button"
						onclick={() => {
							handleAddOption();
						}}
						class="bg-light-brown text-off-white hover:bg-dark-olive h-max w-max rounded-full p-1"
						><Icon icon="gg:add" class="size-6" /></button
					>
					<Tooltip class="bg-dark-olive text-off-white">Добавить описание</Tooltip>
				</label>
			</div>
		</div>
	{:else}
		<div>
			{#each finish.options as finishOption}
				<p class="flex items-start gap-2 text-lg">
					<Icon
						icon={finishOption.isAvailable
							? 'ic:round-check-circle-outline'
							: 'material-symbols:cancel-outline-rounded'}
						class="mt-1 size-6 shrink-0 {finishOption.isAvailable
							? 'text-dark-brown'
							: 'text-light-olive'}"
					/>{finishOption.description}
				</p>
			{/each}

			<div class="mt-6 flex flex-col gap-4 max-[1300px]:items-center">
				<h4 class="w-max rounded-2xl text-xl font-medium">
					Цена: {prettyPrice.format(finish.price!)}
				</h4>
			</div>
		</div>
	{/if}
	{#if !isSaved}
		<button
			class="bg-dark-olive text-off-white mt-8 rounded-2xl p-2 text-lg"
			onclick={() => handleSaveFinish()}>Сохранить</button
		>
	{:else}
		<button
			class="bg-dark-olive text-off-white mt-8 block rounded-2xl p-2 text-lg max-[600px]:mx-auto"
			onclick={() => handleEditFinish()}>Редактировать</button
		>
	{/if}
</TabItem>
