<script lang="ts">
	import { type FinishDto } from '$lib/types';
	import { getFinishTypeName } from '$lib/utils';
	import Icon from '@iconify/svelte';

	import { TabItem } from 'flowbite-svelte';
	import { tv } from 'tailwind-variants';

	let { finish = $bindable<FinishDto>(), isOpen = false }: { finish: FinishDto; isOpen?: boolean } =
		$props();

	const inputText = tv({
		base: 'text-dark-olive placeholder:text-light-olive caret-dark-olive border-light-olive focus:border-dark-brown focus:ring-dark-brown form-input w-fit rounded-2xl bg-transparent'
	});
	const inputCheckbox = tv({
		base: 'text-dark-brown border-light-brown focus:border-dark-brown focus:ring-dark-brown bg-off-white form-checkbox size-5 rounded'
	});

	let isOptionAvailable: boolean = $state(false);
	let optionDescription: string = $state('');

	function onOptionAdd() {
		if (optionDescription.length === 0) return;

		finish.options.push({ isAvailable: isOptionAvailable, description: optionDescription });

		isOptionAvailable = false;
		optionDescription = '';
	}
</script>

<TabItem open={isOpen} inactiveClass="hover:bg-dark-olive rounded-t-lg h-full group w-full p-4">
	{#snippet titleSlot()}
		<div class="flex items-center gap-1 max-[650px]:justify-center">
			<Icon
				icon="hugeicons:thermometer-cold"
				class="text-dark-olive group-hover:text-off-white size-8"
			/>
			<p class="text-dark-olive group-hover:text-off-white text-lg">
				{getFinishTypeName(finish.type)}
			</p>
		</div>
	{/snippet}
	<div class="flex flex-col items-start">
		<div class="mt-6 flex flex-col gap-4 max-[1300px]:items-center">
			<lable class="mb-12 flex w-max flex-col rounded-2xl text-xl font-medium"
				>Цена<input
					type="number"
					name="price"
					id="price"
					class={inputText()}
					bind:value={finish.price}
				/></lable
			>
		</div>
		<h4 class="mb-2 flex w-max flex-col rounded-2xl text-xl font-medium">Описание</h4>
		{#each finish.options as option, i (i)}
			<lable class="flex items-center gap-2 text-lg">
				<Icon
					icon={option.isAvailable
						? 'ic:round-check-circle-outline'
						: 'material-symbols:cancel-outline-rounded'}
					class=" size-6 shrink-0 {option.isAvailable ? 'text-dark-brown' : 'text-light-olive'}"
				/>{option.description}
			</lable>
		{/each}
		<div class="flex w-full flex-col gap-4">
			<label>
				<input
					type="checkbox"
					bind:checked={isOptionAvailable}
					name="veranda"
					id="veranda"
					class={inputCheckbox()}
				/>
				<input
					type="text"
					bind:value={optionDescription}
					name="option"
					id="option"
					class={inputText()}
				/>
			</label>
			<button
				type="button"
				onclick={onOptionAdd}
				class="bg-dark-olive text-off-white hover:bg-light-brown h-max w-max rounded-2xl px-4 py-2 text-lg"
				>Добавить +</button
			>
		</div>
	</div>
</TabItem>
