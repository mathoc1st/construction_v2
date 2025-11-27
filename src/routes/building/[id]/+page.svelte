<script lang="ts">
	import BuildingCarousel from '$lib/components/ui/BuildingCarousel.svelte';
	import BuildingDetail from '$lib/components/ui/BuildingDetail.svelte';
	import type { PageProps } from './$types';

	const { data: building }: PageProps = $props();
</script>

<section class="mx-auto mt-26 mb-26 max-w-[1440px] px-5">
	<section class="flex gap-6 max-[1300px]:flex-col">
		<BuildingCarousel buildingImages={building.images} />
		<BuildingDetail {building} isAdmin={building.isAdmin} />
	</section>
</section>
