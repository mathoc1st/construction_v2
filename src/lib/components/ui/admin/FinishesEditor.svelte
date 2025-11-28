<script lang="ts">
	import { Tabs } from 'flowbite-svelte';
	import { finishSchema, FinishType, type FinishDto, type ParsedFinish } from '$lib/types';
	import { getFinishTypeName } from '$lib/utils';
	import FinishTabEditor from './FinishTabEditor.svelte';

	let {
		savedFinishes,
		onDeleteFinish,
		onSaveFinish
	}: {
		savedFinishes: FinishDto[];
		onDeleteFinish: (finishType: FinishType) => void;
		onSaveFinish: (finish: ParsedFinish) => void;
	} = $props();

	let finishes: FinishDto[] = $derived(savedFinishes);

	let selectedFinish: FinishType = $state(FinishType.COLD);
	let selectedTab: string | undefined = $state();

	function handleAddFinish() {
		if (finishes.some((f) => f.type === selectedFinish)) return;

		finishes.push({ type: selectedFinish });
		selectedTab = selectedFinish;

		finishes.sort((a, b) => {
			const order = Object.keys(FinishType);
			return order.indexOf(a.type) - order.indexOf(b.type);
		});
	}

	function handleSaveFinish(finish: FinishDto) {
		const parsedFinishResult = finishSchema.safeParse(finish);

		if (!parsedFinishResult.success) return;

		const index = finishes.findIndex((f) => f.type === parsedFinishResult.data.type);

		if (index < 0) {
			finishes.push(parsedFinishResult.data);
		} else {
			finishes[index] = parsedFinishResult.data;
		}

		onSaveFinish(parsedFinishResult.data);
	}

	function handleDeleteFinish(finishType: FinishType) {
		finishes = finishes.filter((f) => f.type !== finishType);

		onDeleteFinish(finishType);

		if (finishes.length > 0) selectedTab = finishes[finishes.length - 1].type;
	}
</script>

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
		class="text-dark-olive mt-4 rounded-2xl bg-transparent disabled:cursor-not-allowed!"
		id="type"
		name="type"
		disabled={Object.values(FinishType).length === finishes.length}
		bind:value={selectedFinish}
		required
	>
		{#each Object.values(FinishType) as finishType}
			<option hidden={finishes.some((f) => f.type === finishType)} value={finishType}
				>{getFinishTypeName(finishType)}</option
			>
		{/each}
	</select>

	<button
		type="button"
		onclick={handleAddFinish}
		disabled={Object.values(FinishType).length === finishes.length}
		class="bg-dark-olive text-off-white hover:bg-light-brown disabled:bg-off-white disabled:border-light-olive disabled:text-dark-olive mt-4 h-max w-max rounded-2xl px-4 py-2 text-lg disabled:cursor-not-allowed! disabled:border"
		>Добавить</button
	>
</div>
<div class="w-max">
	{#if finishes && finishes.length > 0}
		<Tabs
			selected={selectedTab}
			class="group grid w-max grid-cols-2 max-[600px]:mx-auto max-[600px]:grid-cols-1"
			classes={{ divider: 'bg-light-olive w-full' }}
		>
			{#each finishes as finish, i (finish.type)}
				<FinishTabEditor
					{finish}
					onSaveFinish={handleSaveFinish}
					onDeleteFinish={handleDeleteFinish}
				/>
			{/each}
		</Tabs>
	{/if}
</div>
