<script lang="ts">
	import type { ListingWithRelationsDto } from '$lib/dtos/listing.dto';
	import { prettyPrice } from '$lib/utils';
	import Icon from '@iconify/svelte';

	interface Props {
		data: ListingWithRelationsDto;
	}

	let { data }: Props = $props();

	let area = $state(
		data.building?.length && data.building?.width
			? data.building.length * data.building.width
			: null
	);

	let dimensions = $state(
		data.building?.length && data.building?.width
			? `${data.building.length}x${data.building.width} м`
			: null
	);

	let startingPrice = $derived.by(() => {
		let startingPrice = 0;
		for (const finish of data.finishes || []) {
			if (finish.price && (startingPrice === 0 || finish.price < startingPrice)) {
				startingPrice = finish.price;
			}
		}
		return startingPrice;
	});
</script>

<div
	class="border-light-olive bg-off-white flex w-[clamp(300px,100%,400px)] min-w-0 shrink flex-col items-center justify-between rounded-2xl border-2 p-4 transition hover:scale-105"
>
	<img
		src={data.listing.images && data.listing.images.length > 0
			? `/api/uploads?key=${data.listing.images[0]}`
			: '/images/placeholder.jpg'}
		alt=""
		onerror={(e) => {
			const img = e.target as HTMLImageElement;
			img.src = '/images/placeholder.jpg';
		}}
		class="h-57.5! rounded-2xl"
	/>
	<h4 class="mt-6 text-xl font-medium max-[600px]:text-lg">
		{data?.listing.title || 'Untitled'}
	</h4>
	<div class="border-light-olive mt-2 h-px w-24 border"></div>
	<div class="mt-6 grid grid-cols-2 gap-2.5 gap-x-8 px-4">
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="ix:align-object-dimensions" class="size-8 min-w-6" /><span
				class="max-[600px]:text-md text-lg">Габариты: {dimensions || 'Unknown'}</span
			>
		</p>
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="bx:area" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Площадь: {area ? `${area} м²` : 'Unknown'}</span
			>
		</p>
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="mdi:bathroom" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Санузлов: {data.building?.bathrooms || 'Unknown'}</span
			>
		</p>

		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="uil:bed" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Комнат: {data.building?.bedrooms || 'Unknown'}</span
			>
		</p>
	</div>
	<p class="mt-8 text-xl font-medium max-[600px]:text-lg">
		От {prettyPrice.format(startingPrice)}
	</p>
	<a
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		href={`/listing/${data.listing.id}`}
		class="bg-dark-brown text-off-white hover:bg-dark-olive mt-4 inline-block rounded-2xl px-8 py-2 transition"
		>Подробнее</a
	>
</div>
