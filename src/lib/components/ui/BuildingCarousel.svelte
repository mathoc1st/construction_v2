<script lang="ts">
	import type { Image } from '$lib/types';
	import {
		Carousel,
		Controls,
		CarouselIndicators,
		Thumbnails,
		Indicator,
		ControlButton
	} from 'flowbite-svelte';

	const { buildingImages }: { buildingImages: Image[] } = $props();

	let index = $state(0);
	let selectedMain = $state(0);

	let images = $derived(
		buildingImages.map((i) => {
			return {
				src: `/api/images/${i.filename}`,
				onerror: (l: Event) => {
					const img = l.target as HTMLImageElement;
					img.src = '/images/placeholder.jpg';
				}
			};
		})
	);

	function onSelectedMain(event: Event, index: number) {
		selectedMain = index;
	}
</script>

<!-- <div
	class="mx-auto max-w-2xl space-y-4 max-[800px]:max-w-lg max-[600px]:max-w-96 max-[400px]:max-w-84"
>
	<Carousel
		images={!images || images.length === 0 ? [{ src: '/images/placeholder.jpg' }] : images}
		bind:index
		class="mx-auto h-[500px]! w-[650px] max-w-full  object-contain object-center max-[600px]:h-86! max-[400px]:h-78!"
	>
		<CarouselIndicators hidden={images.length <= 1}>
			{#snippet children({ selected, index })}
				<Indicator class="bg-dark-brown h-3 w-3  {selected ? 'opacity-100' : 'opacity-30'}"
				></Indicator>
			{/snippet}
		</CarouselIndicators>
		<Controls hidden={images.length <= 1} class="max-[600px]:hidden" />
	</Carousel>
	{#if images.length > 1}
		<Thumbnails
			class="mt-4 max-w-full flex-wrap gap-2 bg-transparent max-[800px]:hidden"
			{images}
			bind:index
		>
			{#snippet children({ image, selected, Thumbnail })}
				<Thumbnail
					{selected}
					{...image}
					class="h-[100px] max-w-[100px] rounded-md object-contain {selected
						? 'border-light-olive border-2'
						: ''}"
				/>
			{/snippet}
		</Thumbnails>
	{/if}
</div> -->
<div class="shrink-0 basis-1/2 max-[1100px]:basis-full">
	<Carousel
		images={!images || images.length === 0 ? [{ src: '/images/placeholder.jpg' }] : images}
		bind:index
		class="mx-auto mb-6 h-[450px]! max-[1100px]:max-w-[700px] max-[600px]:h-[350px]! max-[400px]:h-[300px]!"
	>
		<CarouselIndicators
			hidden={images.length <= 1}
			class="flex w-[80%] flex-wrap items-center justify-center gap-y-2"
		>
			{#snippet children({ selected, index })}
				<Indicator class="bg-dark-brown h-3 w-3  {selected ? 'opacity-100' : 'opacity-30'}"
				></Indicator>
			{/snippet}
		</CarouselIndicators>

		{#if images.length > 1}
			<Controls hidden={images.length <= 1} class=" max-[600px]:hidden">
				{#snippet children(changeSlide)}
					<ControlButton
						name="Previous"
						forward={false}
						onclick={() => changeSlide(false)}
						class="group"
						spanClass="bg-light-brown hover:bg-dark-olive group-hover:bg-dark-olive text-off-white"
					/>

					<ControlButton
						name="Next"
						forward={true}
						onclick={() => changeSlide(true)}
						class="group"
						spanClass="bg-light-brown hover:bg-dark-olive group-hover:bg-dark-olive text-off-white"
					/>
				{/snippet}
			</Controls>
		{/if}
	</Carousel>

	{#if images.length > 1}
		<Thumbnails
			class="mt-4 flex max-w-full flex-wrap justify-start gap-2 bg-transparent max-[800px]:hidden"
			{images}
			bind:index
		>
			{#snippet children({ image, selected, Thumbnail })}
				<Thumbnail
					{selected}
					{...image}
					class="h-[100px] w-[100px] rounded-md object-contain {selected
						? 'border-light-olive border-2'
						: ''}"
				/>
			{/snippet}
		</Thumbnails>
	{/if}
</div>
