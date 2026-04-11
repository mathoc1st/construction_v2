<script lang="ts">
	import type { ImageDto } from '$lib/dtos/image.dto';
	import {
		Carousel,
		Controls,
		CarouselIndicators,
		Thumbnails,
		Indicator,
		ControlButton
	} from 'flowbite-svelte';

	const { buildingImages }: { buildingImages: ImageDto[] } = $props();

	let index = $state(0);

	// let imageUrls: { src: string }[] = $state([]);
</script>

<div class="shrink-0 basis-1/2 max-[1100px]:basis-full">
	<Carousel
		images={!buildingImages || buildingImages.length === 0
			? [{ src: '/images/placeholder.jpg' }]
			: buildingImages.map((img) => ({ src: img.url }))}
		bind:index
		class="mx-auto mb-6 h-112.5! max-[1100px]:max-w-175 max-[600px]:h-87.5! max-[400px]:h-75!"
	>
		<CarouselIndicators
			hidden={!buildingImages || buildingImages.length <= 1}
			class="flex w-[80%] flex-wrap items-center justify-center gap-y-2"
		>
			{#snippet children({ selected })}
				<Indicator class="bg-dark-brown h-3 w-3  {selected ? 'opacity-100' : 'opacity-30'}"
				></Indicator>
			{/snippet}
		</CarouselIndicators>

		{#if buildingImages && buildingImages.length > 1}
			<Controls hidden={!buildingImages || buildingImages.length <= 1} class=" max-[600px]:hidden">
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

	{#if buildingImages && buildingImages.length > 1}
		<Thumbnails
			class="mt-4 flex max-w-full flex-wrap justify-start gap-2 bg-transparent max-[800px]:hidden"
			images={buildingImages.map((img) => ({ src: img.url }))}
			bind:index
		>
			{#snippet children({ image, selected, Thumbnail })}
				<Thumbnail
					{selected}
					{...image}
					class="h-25 w-25 rounded-md object-contain {selected
						? 'border-light-olive border-2'
						: ''}"
				/>
			{/snippet}
		</Thumbnails>
	{/if}
</div>
