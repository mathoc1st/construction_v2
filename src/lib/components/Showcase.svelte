<script lang="ts">
	import { BuildingType } from '$lib/types';
	import BuildingCard from './ui/BuildingCard.svelte';

	let selectedType: BuildingType = $state(BuildingType.FRAME);

	function handleTypeChange(event: Event, type: BuildingType) {
		selectedType = type;
	}
	$inspect(selectedType);
</script>

<section class="mt-36 mb-12">
	<h1 class="text-dark-olive mb-18 text-center text-4xl font-medium max-[600px]:text-3xl">
		Популярные проекты
	</h1>
	<h2 class="mb-8 text-center text-3xl max-[600px]:text-2xl">Тип строения</h2>
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
		<BuildingCard />
		<BuildingCard />
		<BuildingCard />
	</div>
</section>
