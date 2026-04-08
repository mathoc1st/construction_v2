<script lang="ts">
	import type { ImageDto } from '$lib/dtos/image.dto';
	import Icon from '@iconify/svelte';
	import {
		Carousel,
		Controls,
		Tooltip,
		CarouselIndicators,
		Thumbnails,
		Indicator,
		Fileupload,
		ControlButton
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';

	interface Props {
		images?: ImageDto[];
	}

	let { images = $bindable() }: Props = $props();

	let imageContainer: HTMLDivElement | null = $state(null);

	onMount(() => {
		const buttons = imageContainer?.querySelectorAll('button:not([type])');

		buttons?.forEach((btn) => {
			(btn as HTMLButtonElement).type = 'button';
		});
	});

	let imageIndex = $state(0);
	let selectedFiles = $state<FileList | null>(null);
	let previews: { src: string }[] = $state([]);

	$effect(() => {
		if (!images || images.length === 0) {
			previews = [{ src: '/images/placeholder.jpg' }];
			return;
		}

		(async () => {
			const newPreviews = await Promise.all(
				images.map(async (image) => {
					const res = await fetch(`/api/uploads?key=${image.folder}/${image.key}`);
					const { url } = await res.json();

					return { src: url };
				})
			);

			previews = newPreviews;
		})();
	});

	async function handleAddImages(event: Event) {
		const input = event.target as HTMLInputElement;

		if (!input.files) return;

		const files = Array.from(input.files);

		input.value = '';

		const formData = new FormData();

		files.forEach((file) => {
			formData.append('files', file);
		});

		const res = await fetch('/api/uploads', {
			method: 'POST',
			body: formData
		});

		const uploads: ImageDto[] = await res.json();

		images = [...(images ?? []), ...uploads];
	}

	async function onImageDelete(_: Event, index: number) {
		if (!images || images.length === 0) return;

		images = images.filter((_, i) => i !== index);
		imageIndex = Math.max(0, index - 1);
	}

	function onSelectedMain(event: Event, index: number) {
		if (!images) return;

		const oldMain = images[0];
		images[0] = images[index];
		images[index] = oldMain;

		imageIndex = 0;
	}
</script>

<div bind:this={imageContainer} class="shrink-0 basis-1/2 max-[1100px]:basis-full">
	{#key previews}
		<Carousel
			images={previews}
			bind:index={imageIndex}
			class="mx-auto mb-6 h-112.5! max-[1100px]:max-w-175 max-[600px]:h-87.5! max-[400px]:h-75!"
		>
			{#snippet slide({ index, Slide })}
				<p
					class="bg-dark-olive text-off-white absolute top-5 left-5 z-50 hidden rounded-2xl p-3 text-sm {images &&
					images.length > 0 &&
					index === 0
						? 'block!'
						: ''}"
				>
					Главная
				</p>
				<div class="absolute top-5 right-5 z-50">
					<Tooltip class="bg-dark-olive text-off-white">Сделать картинку главной</Tooltip>
					<button
						type="button"
						onclick={(e) => onSelectedMain(e, index)}
						class={[
							'text-dark-olive hover:text-dark-brown  transition ',
							{ hidden: !images || images.length === 0 || index === 0 }
						]}><Icon icon="material-symbols:image-outline" class="size-8" /></button
					>
				</div>

				<Slide image={previews[index]} class="object-cover object-center" />

				<div class="absolute right-5 bottom-5 z-50">
					<Tooltip class="bg-dark-olive text-off-white">Удалить картинку</Tooltip>
					<button
						type="button"
						onclick={(e) => onImageDelete(e, index)}
						class={[
							'hover:text-dark-brown  transition',
							{ hidden: !images || images.length === 0 }
						]}><Icon icon="tabler:trash" class="size-8" /></button
					>
				</div>
			{/snippet}

			<CarouselIndicators
				hidden={previews.length <= 1}
				class="flex w-[80%] flex-wrap items-center justify-center gap-y-2"
			>
				{#snippet children({ selected })}
					<Indicator class="bg-dark-brown h-3 w-3  {selected ? 'opacity-100' : 'opacity-30'}"
					></Indicator>
				{/snippet}
			</CarouselIndicators>

			{#if previews.length > 1}
				<Controls hidden={previews.length <= 1} class=" max-[600px]:hidden">
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
	{/key}
	<Fileupload
		clearableOnClick={() => {
			images = [];
		}}
		classes={{
			wrapper: 'flex max-[1100px]:justify-center',
			close: [
				'text-off-white relative hover:text-dark-olive hidden bg-light-brown rounded-r-2xl',
				{ block: images && images.length > 0 }
			]
		}}
		class={[
			'bg-dark-olive text-off-white max-w-max rounded-2xl border-0 pr-8!',
			{ 'rounded-r-none pr-2': images && images.length > 0 }
		]}
		id="file"
		name="file"
		clearable
		onchange={handleAddImages}
		multiple
		accept="image/*"
		bind:files={selectedFiles}
	/>
	{#if previews.length > 1}
		<Thumbnails
			class="mt-4 flex max-w-full flex-wrap justify-start gap-2 bg-transparent max-[800px]:hidden"
			images={previews}
			bind:index={imageIndex}
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
