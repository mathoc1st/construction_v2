<script lang="ts">
	import BuildingCarousel from '$lib/components/ui/BuildingCarousel.svelte';
	import BuildingDetail from '$lib/components/ui/BuildingDetail.svelte';
	import Finishes from '$lib/components/ui/Finishes.svelte';
</script>

<section class="mt-26 mb-26 flex gap-6 max-[1300px]:flex-col">
	<BuildingCarousel />
	<BuildingDetail />
	<Finishes />
</section>
