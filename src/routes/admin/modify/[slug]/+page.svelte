<script lang="ts">
	import { invalidateAll, refreshAll } from '$app/navigation';
	import DetailsEditor from '$lib/components/ui/admin/DetailsEditor.svelte';
	import FinishesEditor from '$lib/components/ui/admin/FinishesEditor.svelte';
	import ImageEditor from '$lib/components/ui/admin/ImageEditor.svelte';
	import {
		buildingSchema,
		FinishType,
		type BuildingDto,
		type Image,
		type ParsedBuilding,
		type ParsedFinish
	} from '$lib/types';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	let { data, params }: PageProps = $props();

	let savedBuilding: ParsedBuilding | null = $state(data.building ?? null);
	let savedImages: File[] = $state([]);
	let savedFinishes: ParsedFinish[] = $state(data.building?.finishes ?? []);

	let uploadError: string | null = $state(null);
	let uploadSuccess: boolean = $state(false);

	onMount(async () => {
		if (!data.building || !data.building.images) return;
		savedImages = await loadSavedImages(data.building.images);
	});

	async function loadSavedImages(images: Image[]) {
		const imageFiles: File[] = [];
		for (const image of images) {
			const res = await fetch(`/api/images/${image.filename}`);
			if (!res.ok) continue;
			const blob = await res.blob();
			imageFiles.push(new File([blob], image.filename, { type: blob.type }));
		}

		return imageFiles;
	}

	function handleSaveBuilding(building: BuildingDto) {
		const result = buildingSchema.safeParse(building);

		if (!result.success) {
			return;
		}

		savedBuilding = result.data;
	}
	function handleSaveFinish(parsedFinishes: ParsedFinish) {
		if (savedFinishes.some((sf) => sf.type === parsedFinishes.type)) return;
		savedFinishes.push(parsedFinishes);
	}

	function handleDeleteFinish(finishType: FinishType) {
		savedFinishes = savedFinishes.filter((sf) => sf.type !== finishType);
	}

	function handleChangeImages(files: File[]) {
		savedImages = files;
	}

	async function handleSubmit() {
		const formData = new FormData();

		savedImages.forEach((i) => formData.append('image', i));
		formData.append('building', JSON.stringify(savedBuilding));
		formData.append('finishes', JSON.stringify(savedFinishes));

		let responce;
		if (!data.building) {
			responce = await fetch(`/api/building`, {
				method: 'POST',
				body: formData
			});
		} else {
			formData.append('id', data.building.id.toString());

			responce = await fetch(`/api/building`, {
				method: 'PUT',
				body: formData
			});
		}

		if (!responce) return;

		const result = await responce.json();

		if (!responce.ok) {
			uploadError = result.message;
			uploadSuccess = false;
			return;
		}

		await invalidateAll();
		window.location.reload();
	}
</script>

<section class="mx-auto flex max-w-[1440px] gap-6 px-5 py-20 max-[1100px]:flex-col">
	<ImageEditor uploadedImages={savedImages} onChangeImages={handleChangeImages} />
	<div class="flex basis-1/2 flex-col gap-8 max-[1300px]:items-center">
		<DetailsEditor {savedBuilding} onSaveBuilding={handleSaveBuilding} />
		<FinishesEditor
			{savedFinishes}
			onDeleteFinish={handleDeleteFinish}
			onSaveFinish={handleSaveFinish}
		/>
		{#if uploadError}
			<h4 class="text-center text-lg text-red-500">Ошибка</h4>
			<p class="mt-4 text-center text-red-400">{uploadError}</p>
		{/if}
		{#if uploadSuccess}
			<h4 class="text-center text-lg text-green-600">Новое строение было успешно добавлено!</h4>
		{/if}
		{#if savedBuilding && savedFinishes.length > 0 && savedImages.length > 0}
			<button
				onclick={handleSubmit}
				class="bg-dark-brown text-off-white mx-auto mt-12 block w-[50%] rounded-2xl px-6 py-2 text-xl"
				>Готово</button
			>
		{/if}
	</div>
</section>
