<script lang="ts">
	import { BuildingType, type Building, type Image } from '$lib/types';
	import BuildingCard from './ui/BuildingCard.svelte';

	interface Props {
		popularFrames: (Building & { images: Image[] })[];
		popularBarns: (Building & { images: Image[] })[];
		popularContainers: (Building & { images: Image[] })[];
	}

	let { popularFrames, popularBarns, popularContainers }: Props = $props();

	let selectedType: BuildingType = $state(BuildingType.FRAME);

	function handleTypeChange(event: Event, type: BuildingType) {
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
				{ 'bg-light-brown text-dark-olive!': selectedType === BuildingType.FRAME }
			]}
		>
			<button
				class="h-full w-full px-6 py-1.5"
				onclick={(e) => handleTypeChange(e, BuildingType.FRAME)}>Каркасный</button
			>
		</li>
		<li
			class={[
				'bg-dark-olive text-off-white hover:bg-light-brown hover:text-dark-olive flex items-center rounded-2xl transition',
				{ 'bg-light-brown text-dark-olive!': selectedType === BuildingType.BARN }
			]}
		>
			<button
				class="h-full w-full px-6 py-1.5"
				onclick={(e) => handleTypeChange(e, BuildingType.BARN)}>Барнхаус</button
			>
		</li>
		<li
			class={[
				'bg-dark-olive text-off-white hover:bg-light-brown hover:text-dark-olive flex items-center rounded-2xl transition',
				{ 'bg-light-brown text-dark-olive!': selectedType === BuildingType.CONTAINER }
			]}
		>
			<button
				class="h-full w-full px-6 py-1.5"
				onclick={(e) => handleTypeChange(e, BuildingType.CONTAINER)}>Бытовка</button
			>
		</li>
	</ul>
	<div class="mt-12 flex flex-wrap justify-center gap-4">
		{#if selectedType === BuildingType.FRAME}
			{#each popularFrames as building (building.id)}
				<BuildingCard {building} />
			{/each}
		{/if}
		{#if selectedType === BuildingType.BARN}
			{#each popularBarns as building (building.id)}
				<BuildingCard {building} />
			{/each}
		{/if}
		{#if selectedType === BuildingType.CONTAINER}
			{#each popularContainers as building (building.id)}
				<BuildingCard {building} />
			{/each}
		{/if}
	</div>
</section>
