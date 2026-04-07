<script>
	import CatalogCard from '$lib/components/ui/CatalogCard.svelte';
	import { ConstructionType } from '$lib/types/buildings/building.domain.types';
	// import Searchbar from '$lib/components/ui/Searchbar.svelte';

	// let search = $state('');
</script>

<section class="mx-auto mt-26 mb-32 max-w-360 px-5">
	<h1 class="text-center text-5xl font-medium max-[600px]:text-4xl">Каталог</h1>
	<!-- <Searchbar {search} placeholder="Поиск по каталогу" class="mx-auto mt-20 w-max" /> -->
	<div class="mt-12 flex flex-wrap justify-center gap-16">
		<CatalogCard src="images/frame-house.jpg" type={ConstructionType.FRAME} />
		<CatalogCard src="images/barnhouse.jpg" type={ConstructionType.BARN} />
		<CatalogCard src="images/container.jpg" type={ConstructionType.CONTAINER} />
	</div>
</section>
