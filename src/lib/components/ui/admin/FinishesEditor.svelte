<script lang="ts">
	import { divider, TabItem, Tabs } from 'flowbite-svelte';
	import { FinishType, type FinishDto, type FinishOptionDto } from '$lib/types';
	import { getFinishTypeName, getTabIcon, prettyPrice } from '$lib/utils';
	import FinishTabEditor from './FinishTabEditor.svelte';
	import Icon from '@iconify/svelte';

	let { onSaveFinishes }: { onSaveFinishes: (finishes: FinishDto[]) => void } = $props();

	let finishes: FinishDto[] = $state([]);
	let selectedFinish: FinishType = $state(FinishType.COLD);
	let selectedTab: string | undefined = $state();
	let isSaved: boolean = $state(false);

	function handleSaveFinishes(finishes: FinishDto[]) {
		if (!finishes || finishes.length === 0) return;
		for (const finish of finishes) {
			if (!finish.options || finish.options.length === 0 || !finish.price) return;
		}
		onSaveFinishes(finishes);
		isSaved = true;
	}

	function handleEdit() {
		isSaved = false;
	}

	function handleAddOption(finishType: FinishType, option: FinishOptionDto) {
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

	function handleDeleteOption(finishType: FinishType, optionIndex: number) {
		const index = finishes.findIndex((f) => f.type === finishType);
		if (index < 0 || !finishes[index].options) return;

		if (index < 0 && index >= finishes[index].options.length) return;

		finishes[index].options.splice(optionIndex, 1);
	}

	function handleDeleteFinish(finishType: FinishType) {
		const index = finishes.findIndex((f) => f.type === finishType);
		if (index < 0) return;

		finishes.splice(index, 1);

		if (index > 0) selectedTab = finishes[index - 1].type;
	}

	function handlePriceChange(finishType: FinishType, price: number) {
		const index = finishes.findIndex((f) => f.type === finishType);
		if (index < 0) return;

		finishes[index].price = price;
	}
</script>

{#if !isSaved}
	<div
		class="relative mt-4 flex max-w-max flex-col max-[1300px]:items-center
	"
	>
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
{/if}
<div class="w-max">
	{#key isSaved}
		{#if finishes && finishes.length > 0}
			<Tabs
				selected={selectedTab}
				class="group grid w-max grid-cols-2 max-[600px]:mx-auto max-[600px]:grid-cols-1"
				classes={{ divider: 'bg-light-olive w-full' }}
			>
				{#if !isSaved}
					{#each finishes as finish, i (i)}
						<FinishTabEditor
							isOpen={i === 0}
							finishType={finish.type}
							options={finish.options}
							onAddOption={handleAddOption}
							onDeleteOption={handleDeleteOption}
							onDeleteFinish={handleDeleteFinish}
							onPriceChange={handlePriceChange}
						/>
					{/each}
				{:else}
					{#each finishes as finish, i (i)}
						<TabItem
							open
							inactiveClass="hover:bg-dark-olive rounded-t-lg h-full group w-full p-4"
							activeClass="h-full bg-dark-brown text-off-white! rounded-t-lg group w-full p-4"
						>
							{#snippet titleSlot()}
								<div class="flex items-center gap-1 max-[650px]:justify-center">
									<Icon
										icon={getTabIcon(finish.type)}
										class=" group-hover:text-off-white size-8 shrink-0"
									/>
									<p class=" group-hover:text-off-white text-lg">
										{getFinishTypeName(finish.type)}
									</p>
								</div>
							{/snippet}
							<div>
								{#each finish.options as finishOption}
									<p class="flex items-start gap-2 text-lg">
										<Icon
											icon={finishOption.isAvailable
												? 'ic:round-check-circle-outline'
												: 'material-symbols:cancel-outline-rounded'}
											class="text-dark-brown mt-1 size-6 shrink-0"
										/>{finishOption.description}
									</p>
								{/each}

								<div class="mt-6 flex flex-col gap-4 max-[1300px]:items-center">
									<h4 class="w-max rounded-2xl text-xl font-medium">
										Цена: {prettyPrice.format(finish.price!)}
									</h4>
								</div>
							</div>
						</TabItem>
					{/each}
				{/if}
			</Tabs>

			{#if !isSaved}
				<button
					class="bg-dark-olive text-off-white mt-8 rounded-2xl p-2 text-lg"
					onclick={() => handleSaveFinishes(finishes)}>Сохранить</button
				>
			{:else}
				<button
					class="bg-dark-olive text-off-white mt-8 block rounded-2xl p-2 text-lg max-[600px]:mx-auto"
					onclick={() => handleEdit()}>Редактировать</button
				>
			{/if}
		{/if}
	{/key}
</div>
