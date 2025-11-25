<script lang="ts">
	import type { getBuildingById } from '$lib/server/db/queries/building';
	import type { Building } from '$lib/types';
	import { getFinishTypeName } from '$lib/utils';
	import Icon from '@iconify/svelte';

	import { Tabs, TabItem } from 'flowbite-svelte';

	const { building }: { building: NonNullable<Awaited<ReturnType<typeof getBuildingById>>> } =
		$props();
</script>

<div class="flex flex-col justify-center max-[1300px]:items-center">
	<a
		href={`/admin/edit/${building.id}`}
		class="hover:bg-light-brown hover:text-dark-olive group bg-dark-olive text-off-white flex max-w-max items-center gap-2 rounded-2xl p-2 text-lg"
		><Icon
			icon="solar:pen-linear"
			class="text-off-white group-hover:text-dark-olive size-6"
		/>Редактировать</a
	>
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
			<TabItem open inactiveClass="hover:bg-dark-olive rounded-t-lg h-full group w-full p-4">
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
				<div>
					{#each finish.options as finishOption}
						<p class="flex items-center gap-2 text-lg">
							<Icon
								icon={finishOption.isAvailable
									? 'ic:round-check-circle-outline'
									: 'material-symbols:cancel-outline-rounded'}
								class="text-dark-brown size-6 shrink-0"
							/>{finishOption.description}
						</p>
					{/each}

					<div class="mt-6 flex flex-col gap-4 max-[1300px]:items-center">
						<h4 class="w-max rounded-2xl text-xl font-medium">Цена: {finish.price} ₽</h4>
						<button
							class="bg-dark-brown text-off-white hover:bg-dark-olive h-max w-max rounded-2xl px-8 py-4 text-xl font-medium"
							>Заказать</button
						>
					</div>
				</div>
			</TabItem>
		{/each}
	</Tabs>
</div>

<style>
	:global([role='tabpanel']) {
		background-color: transparent;
	}
</style>
