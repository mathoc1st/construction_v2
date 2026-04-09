<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ConstructionType } from '$lib/types/buildings/building.domain.types';

	import { getBuildingTypeName } from '$lib/utils';

	let { src, type }: { src: string; type: ConstructionType } = $props();
</script>

<a
	href={resolve(`/catalog/${type.toLowerCase()}`)}
	class="border-light-olive group block rounded-2xl border-2 p-1 transition hover:scale-105"
>
	<h3 class="text-dark-olive mt-4 text-center text-3xl max-[600px]:text-2xl">
		{getBuildingTypeName(type)}
	</h3>
	<div class="border-light-olive mx-auto mt-4 h-px w-28 border transition group-hover:w-32"></div>
	<img
		{src}
		alt=""
		class="h-70 max-w-87.5 object-contain object-center max-[600px]:h-50 max-[600px]:w-75"
	/>
</a>
