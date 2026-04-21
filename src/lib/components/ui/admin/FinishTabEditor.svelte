<script lang="ts">
	import { FinishType, type FinishDto } from '$lib/types';
	import { getFinishTypeName, getTabIcon, prettyPrice } from '$lib/utils';
	import Icon from '@iconify/svelte';

	import { TabItem, Textarea } from 'flowbite-svelte';
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
			ffinish.description !== undefined &&
			ffinish.description.length > 0 &&
			ffinish.price !== undefined
	);

	function handleSaveFinish() {
		const priceInput = document.getElementById('price') as HTMLInputElement;

		if (
			finish.description &&
			finish.description.length > 0 &&
			(!finish.price || finish.price === 0)
		) {
			priceInput.classList.add('border-red-500');
			priceInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}

		priceInput.classList.remove('border-red-500');

		onSaveFinish(finish);
		isSaved = true;
	}

	function handleEditFinish() {
		isSaved = false;
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

			<Textarea
				divClass="w-full min-h-64 *:w-full *:h-full"
				bind:value={finish.description}
				name="description"
			></Textarea>
		</div>
	{:else}
		<div>
			<p class="text-dark-olive w-full max-w-150 wrap-break-word whitespace-pre-wrap">
				{finish.description || 'Описание отсутствует.'}
			</p>

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
