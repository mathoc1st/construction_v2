<script lang="ts">
	import type { ListingDto } from '$lib/dtos/listing.dto';
	import { ConstructionType } from '$lib/types/buildings/building.domain.types';
	import BuildingCard from './ui/BuildingCard.svelte';

	let {
		popularFrame,
		popularBarn,
		popularContainer
	}: {
		popularFrame: ListingDto[];
		popularBarn: ListingDto[];
		popularContainer: ListingDto[];
	} = $props();

	let selectedType: ConstructionType = $state(ConstructionType.FRAME);

	function handleTypeChange(event: Event, type: ConstructionType) {
		selectedType = type;
	}
</script>

<section class="mx-auto mt-46 mb-46 max-w-360 px-5">
	<h1 class="text-dark-olive mb-18 text-center text-5xl font-medium max-[600px]:text-4xl">
		Популярные проекты
	</h1>
	<h3 class="mb-8 text-center text-3xl max-[600px]:text-2xl">Тип строения</h3>
	<ul class="mx-auto flex max-w-max flex-wrap items-center justify-center gap-2">
		<li
			class={[
				'bg-dark-olive text-off-white hover:bg-light-brown hover:text-dark-olive flex items-center rounded-2xl transition',
				{ 'bg-light-brown text-dark-olive!': selectedType === ConstructionType.FRAME }
			]}
		>
			<button
				class="h-full w-full px-6 py-1.5"
				onclick={(e) => handleTypeChange(e, ConstructionType.FRAME)}>Каркасный</button
			>
		</li>
		<li
			class={[
				'bg-dark-olive text-off-white hover:bg-light-brown hover:text-dark-olive flex items-center rounded-2xl transition',
				{ 'bg-light-brown text-dark-olive!': selectedType === ConstructionType.BARN }
			]}
		>
			<button
				class="h-full w-full px-6 py-1.5"
				onclick={(e) => handleTypeChange(e, ConstructionType.BARN)}>Барнхаус</button
			>
		</li>
		<li
			class={[
				'bg-dark-olive text-off-white hover:bg-light-brown hover:text-dark-olive flex items-center rounded-2xl transition',
				{ 'bg-light-brown text-dark-olive!': selectedType === ConstructionType.CONTAINER }
			]}
		>
			<button
				class="h-full w-full px-6 py-1.5"
				onclick={(e) => handleTypeChange(e, ConstructionType.CONTAINER)}>Бытовка</button
			>
		</li>
	</ul>
	<div class="mt-12 flex flex-wrap justify-center gap-4">
		{#if selectedType === ConstructionType.FRAME}
			{#each popularFrame as record (record.id)}
				<BuildingCard listing={record} />
			{/each}
		{/if}
		{#if selectedType === ConstructionType.BARN}
			{#each popularBarn as record (record.id)}
				<BuildingCard listing={record} />
			{/each}
		{/if}
		{#if selectedType === ConstructionType.CONTAINER}
			{#each popularContainer as record (record.id)}
				<BuildingCard listing={record} />
			{/each}
		{/if}
	</div>
</section>
