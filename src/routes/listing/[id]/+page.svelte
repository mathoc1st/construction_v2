<script lang="ts">
	import BuildingCarousel from '$lib/components/ui/BuildingCarousel.svelte';
	import BuildingDetail from '$lib/components/ui/BuildingDetail.svelte';
	import type { PageProps } from './$types';

	const { data: listingWithRelations, form }: PageProps = $props();
</script>

<section class="mx-auto mt-26 mb-26 max-w-360 px-5">
	<section class="flex gap-6 max-[1300px]:flex-col">
		<BuildingCarousel buildingImages={listingWithRelations.listing.images} />
		<BuildingDetail
			isSent={form?.success}
			building={listingWithRelations}
			isAdmin={listingWithRelations.isAdmin}
		/>
	</section>
</section>
