<script lang="ts">
	import { goto } from '$app/navigation';
	import type { getBuildingById } from '$lib/server/db/queries/building';
	import { FinishType } from '$lib/types';
	import { getFinishTypeName, getTabIcon, prettyPrice } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { redirect } from '@sveltejs/kit';

	import { Tabs, TabItem, Modal } from 'flowbite-svelte';

	const { building }: { building: NonNullable<Awaited<ReturnType<typeof getBuildingById>>> } =
		$props();

	let isModalOpen = $state(false);
	let isDeleteError = $state(false);
	let deleteError = $state('');

	async function removeBuilding(id: number) {
		isDeleteError = false;
		const params = new URLSearchParams();
		params.append('id', id.toString());

		const response = await fetch(`/api/building?${params}`, { method: 'DELETE' });

		if (!response.ok) {
			isDeleteError = true;
			deleteError = (await response.json()).message;
			return;
		}

		goto(`/catalog/${building.type.toLowerCase()}`);
	}
</script>

<div class="flex flex-col justify-center max-[1300px]:items-center">
	<div class="flex flex-wrap justify-between">
		<a
			href={`/admin/edit/${building.id}`}
			class="hover:bg-light-brown hover:text-dark-olive group bg-dark-olive text-off-white flex max-w-max items-center gap-2 rounded-2xl p-2 text-lg"
			><Icon
				icon="solar:pen-linear"
				class="text-off-white group-hover:text-dark-olive size-6"
			/>Редактировать</a
		>
		<button
			onclick={async () => {
				await removeBuilding(building.id);
			}}
			class="hover:bg-light-brown hover:text-dark-olive group bg-light-brown text-off-white flex max-w-max items-center gap-2 rounded-2xl p-2 text-lg"
			><Icon
				icon="material-symbols:delete-outline-rounded"
				class="text-off-white group-hover:text-dark-olive size-6"
			/>Удалить</button
		>
	</div>
	{#if isDeleteError}
		<p class="text-lg text-red-500">Не удалось удалить строение! <br />{deleteError}</p>
	{/if}
	<h2
		class="text-dark-olive text-4xl font-medium max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-3xl"
	>
		{building.name || 'Untitled'}
	</h2>
	<div class="border-light-olive bg-light-olive mt-4 h-px w-40 border"></div>
	<h4 class="text-dark-olive mt-6 text-3xl max-[600px]:text-2xl">Паспорт объекта</h4>
	<div class="place-i mt-6 grid grid-cols-2 gap-2.5 gap-x-8">
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="ix:align-object-dimensions" class="size-8 min-w-6" /><span
				class="max-[600px]:text-md text-lg">Габариты: {building.size || 'Unknown'}</span
			>
		</p>
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="bx:area" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Площадь: {!building.length || !building.width
					? 'Unknown'
					: `${building.length}x${building.width}`} м<sup>2</sup></span
			>
		</p>
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="mdi:bathroom" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Санузелов: {building.bathrooms || 'Unknown'}</span
			>
		</p>

		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="uil:bed" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Комнат: {building.bedrooms || 'Unknown'}</span
			>
		</p>
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="ri:stairs-line" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Этажность: {building.floors || 'Unknown'}</span
			>
		</p>
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="mdi:veranda" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Веранда: {building.veranda ? 'есть' : 'нет'}</span
			>
		</p>
	</div>

	<h4 class="text-dark-olive mt-14 mb-8 text-3xl">Комплектация</h4>
	<Tabs
		tabStyle="underline"
		classes={{
			active: 'bg-light-brown max-[650px]:w-full border-light-olive',
			divider: 'bg-light-olive'
		}}
		ulClass="max-[650px]:flex-col max-[650px]:w-full"
	>
		{#each building.finishes as finish}
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
							Цена: {prettyPrice.format(finish.price)}
						</h4>
						<button
							onclick={() => (isModalOpen = !isModalOpen)}
							class="bg-dark-brown text-off-white hover:bg-dark-olive h-max w-max rounded-2xl px-8 py-4 text-xl font-medium"
							>Заказать</button
						>
					</div>
				</div>
			</TabItem>
		{/each}
	</Tabs>
</div>

<Modal
	title="Позвоните нам!"
	class="bg-dark-brown divide-none"
	headerClass="text-off-white"
	bind:open={isModalOpen}
>
	<h2 class="text-off-white text-xl">
		Номер данного проекта <span class="text-dark-olive">{building.id}</span>. <br /> Позвоните на номер
		указаный ниже и назовите номер этого проекта оператору.
	</h2>
	<h3 class="text-off-white text-lg font-medium">+7 (926) 656-94-25</h3>
</Modal>

<style>
	:global([role='tabpanel']) {
		background-color: transparent;
	}
</style>
