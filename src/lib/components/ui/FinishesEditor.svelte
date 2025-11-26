<script lang="ts">
	import { Tabs } from 'flowbite-svelte';
	import { FinishType, type FinishDto, type FinishOptionDto } from '$lib/types';
	import { getFinishTypeName } from '$lib/utils';
	import FinishTabEditor from './FinishTabEditor.svelte';

	let { onSaveFinishes }: { onSaveFinishes: (finishes: FinishDto[]) => void } = $props();

	let finishes: FinishDto[] = $state([]);
	let selectedFinish: FinishType = $state(FinishType.COLD);
	let selectedTab: string | undefined = $state();

	function handleSaveFinishes(finishes: FinishDto[]) {
		onSaveFinishes(finishes);
	}

	function onAddOption(finishType: FinishType, option: FinishOptionDto) {
		const index = finishes.findIndex((f) => f.type === finishType);
		if (index < 0) return;

		finishes[index].options ??= [];

		finishes[index].options.push(option);

		finishes[index].options.sort((a, _) => {
			if (a.isAvailable) {
				return -1;
			} else return 1;
		});
	}

	function onDeleteOption(finishType: FinishType, optionIndex: number) {
		const index = finishes.findIndex((f) => f.type === finishType);
		if (index < 0 || !finishes[index].options) return;

		if (index < 0 && index >= finishes[index].options.length) return;

		finishes[index].options.splice(optionIndex, 1);
	}

	function onDeleteFinish(finishType: FinishType) {
		const index = finishes.findIndex((f) => f.type === finishType);
		if (index < 0) return;

		finishes.splice(index, 1);

		if (index > 0) selectedTab = finishes[index - 1].type;
	}

	function onPriceChange(finishType: FinishType, price: number) {
		const index = finishes.findIndex((f) => f.type === finishType);
		if (index < 0) return;

		finishes[index].price = price;
	}
</script>

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
			if (!finishes.some((f) => f.type === selectedFinish)) finishes.push({ type: selectedFinish });
		}}
		class="bg-dark-olive text-off-white hover:bg-light-brown mt-4 h-max w-max rounded-2xl px-4 py-2 text-lg"
		>Добавить</button
	>
</div>

{#if finishes && finishes.length > 0}
	<Tabs
		selected={selectedTab}
		class="mt-8"
		tabStyle="underline"
		classes={{
			active: 'bg-light-brown max-[650px]:w-full border-light-olive',
			divider: 'bg-light-olive'
		}}
		ulClass="max-[650px]:flex-col max-[650px]:w-full flex-wrap "
	>
		{#each finishes as finish, i (i)}
			<FinishTabEditor
				isOpen={i === 0}
				finishType={finish.type}
				options={finish.options}
				{onAddOption}
				{onDeleteOption}
				{onDeleteFinish}
				{onPriceChange}
			/>
		{/each}
	</Tabs>

	<button class="bg-dark-olive text-off-white mt-8 rounded-2xl p-2 text-lg">Сохранить</button>
{/if}
