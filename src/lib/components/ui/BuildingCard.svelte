<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ListingDto } from '$lib/dtos/listing.dto';
	import { prettyPrice } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	interface Props {
		listing: ListingDto;
	}

	let { listing }: Props = $props();

	let area = $derived(
		listing.building?.length && listing.building?.width
			? listing.building.length * listing.building.width
			: null
	);

	let dimensions = $derived(
		listing.building?.length && listing.building?.width
			? `${listing.building.length}x${listing.building.width} м`
			: null
	);

	let image: string = $state('/images/placeholder.jpg');

	onMount(async () => {
		if (listing.images && listing.images.length > 0) {
			image = await getImageUrl(listing.images[0]);
		}
	});

	let startingPrice = $derived.by(() => {
		let startingPrice = 0;
		for (const finish of listing.building.finishes || []) {
			if (finish.price && (startingPrice === 0 || finish.price < startingPrice)) {
				startingPrice = finish.price;
			}
		}
		return startingPrice;
	});

	async function getImageUrl(image: { folder: string; key: string }) {
		const res = await fetch(`/api/uploads?key=${image.folder}/${image.key}`);
		const { url } = await res.json();
		return url;
	}
</script>

<div
	class="border-light-olive bg-off-white flex w-[clamp(300px,100%,400px)] min-w-0 shrink flex-col items-center justify-between rounded-2xl border-2 p-4 transition hover:scale-105"
>
	<div class="w-full">
		<img
			src={listing.images && listing.images.length > 0 ? image : '/images/placeholder.jpg'}
			alt=""
			onerror={(e) => {
				const img = e.target as HTMLImageElement;
				img.src = '/images/placeholder.jpg';
			}}
			class="h-57.5! w-full rounded-2xl object-cover"
		/>
	</div>

	<h4 class="mt-6 text-xl font-medium max-[600px]:text-lg">
		{listing?.title || 'Untitled'}
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
				>Санузлов: {listing.building?.bathrooms || 'Unknown'}</span
			>
		</p>

		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="uil:bed" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Комнат: {listing.building?.bedrooms || 'Unknown'}</span
			>
		</p>
	</div>
	{#if startingPrice === 0}
		<p class="mt-8 text-xl font-medium max-[600px]:text-lg">Цена по запросу</p>
	{:else}
		<p class="mt-8 text-xl font-medium max-[600px]:text-lg">
			От {prettyPrice.format(startingPrice)}
		</p>
	{/if}
	<a
		href={resolve(`/listing/${listing.id}`)}
		class="bg-dark-brown text-off-white hover:bg-dark-olive mt-4 inline-block rounded-2xl px-8 py-2 transition"
		>Подробнее</a
	>
</div>
