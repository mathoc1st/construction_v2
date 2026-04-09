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
	import { onMount } from 'svelte';

	const { buildingImages }: { buildingImages: ImageDto[] } = $props();

	let index = $state(0);

	let imageUrls: { src: string }[] = $state([]);

	onMount(() => {
		buildingImages.forEach(async (image) => {
			const res = await fetch(`/api/uploads?key=${image.folder}/${image.key}`);
			const { url } = await res.json();

			imageUrls = [...imageUrls, { src: url }];
		});
	});
</script>

<div class="shrink-0 basis-1/2 max-[1100px]:basis-full">
	<Carousel
		images={!buildingImages || buildingImages.length === 0
			? [{ src: '/images/placeholder.jpg' }]
			: imageUrls}
		bind:index
		class="mx-auto mb-6 h-112.5! max-[1100px]:max-w-175 max-[600px]:h-87.5! max-[400px]:h-75!"
	>
		<CarouselIndicators
			hidden={imageUrls.length <= 1}
			class="flex w-[80%] flex-wrap items-center justify-center gap-y-2"
		>
			{#snippet children({ selected })}
				<Indicator class="bg-dark-brown h-3 w-3  {selected ? 'opacity-100' : 'opacity-30'}"
				></Indicator>
			{/snippet}
		</CarouselIndicators>

		{#if imageUrls.length > 1}
			<Controls hidden={imageUrls.length <= 1} class=" max-[600px]:hidden">
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

	{#if imageUrls.length > 1}
		<Thumbnails
			class="mt-4 flex max-w-full flex-wrap justify-start gap-2 bg-transparent max-[800px]:hidden"
			images={imageUrls}
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
