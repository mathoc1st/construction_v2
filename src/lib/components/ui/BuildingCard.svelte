<script lang="ts">
	import { page } from '$app/state';
	import type { Building, Image } from '$lib/types';
	import Icon from '@iconify/svelte';

	let { building }: { building: Building & { images: Image[] | undefined } } = $props();
</script>

<div
	class="border-light-olive bg-off-white flex w-[clamp(300px,100%,400px)] min-w-0 shrink flex-col items-center rounded-2xl border-2 p-4 transition hover:scale-105"
>
	<img
		src={building.images && building.images.length > 0
			? `/api/images/${building.images[0].filename}`
			: '/images/placeholder.jpg'}
		alt=""
		onerror={(e) => {
			const img = e.target as HTMLImageElement;
			img.src = '/images/placeholder.jpg';
		}}
		height="230"
		class="rounded-2xl"
	/>
	<h4 class="mt-6 text-xl font-medium max-[600px]:text-lg">{building?.name || 'Untitled'}</h4>
	<div class="border-light-olive mt-2 h-px w-24 border"></div>
	<div class="mt-6 grid grid-cols-2 gap-2.5 gap-x-8 px-4">
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="ix:align-object-dimensions" class="size-8 min-w-6" /><span
				class="max-[600px]:text-md text-lg">Габариты: {building?.size || 'Unknown'}</span
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
	</div>
	<p class="mt-8 text-xl font-medium max-[600px]:text-lg">От {building.startingPrice} руб.</p>
	<a
		href={`/building/${building.id}`}
		class="bg-dark-brown text-off-white hover:bg-dark-olive mt-4 inline-block rounded-2xl px-8 py-2 transition"
		>Подробнее</a
	>
</div>
