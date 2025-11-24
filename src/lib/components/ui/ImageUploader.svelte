<script lang="ts">
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';
	import {
		Carousel,
		Controls,
		Tooltip,
		CarouselIndicators,
		Thumbnails,
		Indicator,
		Fileupload
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let { selectedFiles = $bindable<File[]>() }: { selectedFiles: File[] } = $props();

	// onMount(() => {
	// 	selectedFiles = [];
	// });

	let imageIndex = $state(0);

	let images = $derived.by(() => {
		if (!selectedFiles || selectedFiles.length === 0) {
			return [{ src: '/images/placeholder.jpg' }];
		}

		return selectedFiles.map((f) => {
			return {
				src: URL.createObjectURL(f)
			};
		});
	});

	$effect(() => {
		images;
		const elements = document.querySelectorAll('[aria-label="Click to view image"]');

		for (const element of elements) {
			if (element instanceof HTMLButtonElement) {
				element.type = 'button';
			}
		}
	});

	function handleImages(event: Event) {
		const input = event.target as HTMLInputElement;

		if (!input.files) return;

		let images = Array.from(input.files);

		selectedFiles.push(...images);

		input.value = '';
	}

	function onImageDelete(_: Event, index: number) {
		selectedFiles = selectedFiles.filter((_, i) => i !== index);
		imageIndex = Math.max(0, index - 1);
	}

	function onSelectedMain(event: Event, index: number) {
		const oldMain = selectedFiles[0];
		selectedFiles[0] = selectedFiles[index];
		selectedFiles[index] = oldMain;

		const checkbox = event.target as HTMLInputElement;

		checkbox.checked = false;
		imageIndex = 0;
	}

	function fileArrayToFileList(files: File[]): FileList | null {
		if (!browser) return null;
		const dataTransfer = new DataTransfer();

		for (const file of files) {
			dataTransfer.items.add(file);
		}

		return dataTransfer.files;
	}
</script>

<div
	class="mx-auto max-w-2xl space-y-4 max-[800px]:max-w-lg max-[600px]:max-w-96 max-[400px]:max-w-84"
>
	<Carousel
		{images}
		bind:index={imageIndex}
		class="mx-auto h-[400px]! w-[650px] max-w-full object-contain object-center max-[600px]:h-86! max-[400px]:h-78!"
	>
		{#snippet slide({ index, Slide })}
			<div class="relative">
				<p
					class="bg-dark-olive text-off-white absolute top-5 left-5 z-50 hidden rounded-2xl p-3 text-sm {selectedFiles &&
					selectedFiles.length > 0 &&
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
							{ hidden: !selectedFiles || selectedFiles.length === 0 || index === 0 }
						]}><Icon icon="material-symbols:image-outline" class="size-8" /></button
					>
				</div>

				<Slide image={images[index]} />

				<div class="absolute right-5 bottom-5 z-50">
					<Tooltip class="bg-dark-olive text-off-white">Удалить картинку</Tooltip>
					<button
						type="button"
						onclick={(e) => onImageDelete(e, index)}
						class={[
							'hover:text-dark-brown  transition',
							{ hidden: !selectedFiles || selectedFiles.length === 0 }
						]}><Icon icon="tabler:trash" class="size-8" /></button
					>
				</div>
			</div>
		{/snippet}
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
			bind:index={imageIndex}
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
	<Fileupload
		clearableOnClick={() => {
			selectedFiles = [];
		}}
		classes={{
			wrapper: 'flex',
			close: [
				'text-off-white relative hover:text-dark-olive hidden bg-light-brown rounded-r-2xl',
				{ block: selectedFiles && selectedFiles.length > 0 }
			]
		}}
		clearable
		onchange={handleImages}
		multiple
		class={[
			'bg-dark-olive text-off-white max-w-max rounded-2xl border-0 pr-8!',
			{ 'rounded-r-none pr-2': selectedFiles && selectedFiles.length > 0 }
		]}
		accept="image/*"
		files={fileArrayToFileList(selectedFiles)}
	/>
	<!-- <Helper
		color="emerald"
		class={['text-dark-olive mt-2', { hidden: !selectedFiles || selectedFiles.length === 0 }]}
		>Выбранные фото: {fileNames}</Helper
	> -->
</div>
