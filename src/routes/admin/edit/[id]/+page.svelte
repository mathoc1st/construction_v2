<script lang="ts">
	import DetailsForm from '$lib/components/ui/DetailsForm.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import {
		FinishType,
		type Building,
		type BuildingDto,
		type FinishDto,
		type Image
	} from '$lib/types';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { invalidate, invalidateAll, refreshAll } from '$app/navigation';

	let { data }: PageProps = $props();

	async function getImages(images: Image[]) {
		const imageFiles: File[] = [];
		for (const image of data.building.images) {
			const res = await fetch(`/api/images/${image.filename}`);
			if (!res.ok) continue;
			const blob = await res.blob();
			imageFiles.push(new File([blob], image.filename, { type: blob.type }));
		}

		return imageFiles;
	}

	onMount(async () => {
		images = (await getImages(data.building.images)).reverse();
	});

	$effect(() => {
		data.building.images;
		getImages(data.building.images).then((files) => {
			images = files;
		});
	});

	let editedBuilding: BuildingDto = $state({
		type: data.building.type,
		name: data.building.name,
		length: data.building.length,
		width: data.building.width,
		bedrooms: data.building.bedrooms,
		bathrooms: data.building.bathrooms,
		floors: data.building.floors,
		veranda: data.building.veranda
	});
	let images: File[] = $state([]);
	let coldFinish: FinishDto = $state(
		data.building.finishes.find((f) => f.type === FinishType.COLD) ||
			({ type: FinishType.COLD } as FinishDto)
	);
	let warmFinish: FinishDto = $state(
		data.building.finishes.find((f) => f.type === FinishType.WARM) ||
			({ type: FinishType.WARM } as FinishDto)
	);
	let allYearFinish: FinishDto = $state(
		data.building.finishes.find((f) => f.type === FinishType.ALL_YEAR) ||
			({ type: FinishType.ALL_YEAR } as FinishDto)
	);
	let allYear150Finish: FinishDto = $state(
		data.building.finishes.find((f) => f.type === FinishType.ALL_YEAR_150) ||
			({ type: FinishType.ALL_YEAR_150 } as FinishDto)
	);
	let allYear200Finish: FinishDto = $state(
		data.building.finishes.find((f) => f.type === FinishType.ALL_YEAR_200) ||
			({ type: FinishType.ALL_YEAR_200 } as FinishDto)
	);

	let uploadError: string | null = $state(null);
	let uploadSuccess: boolean = $state(false);

	async function handleSubmit() {
		const formData = new FormData();

		images.forEach((i) => formData.append('image', i));
		formData.append('building', JSON.stringify(editedBuilding));
		formData.append('id', data.building.id.toString());
		formData.append(
			'finishes',
			JSON.stringify([coldFinish, warmFinish, allYearFinish, allYear150Finish, allYear200Finish])
		);
		formData.append('images', JSON.stringify(images));

		const responce = await fetch(`/api/building`, {
			method: 'PUT',
			body: formData
		});
		const result = await responce.json();

		if (!responce.ok) {
			uploadError = result.message;
			uploadSuccess = false;
			return;
		}

		uploadError = null;
		uploadSuccess = true;

		await refreshAll();
	}
</script>

<section class="mt-26 mb-26">
	<div class="flex gap-6 max-[1300px]:flex-col">
		<ImageUploader bind:images />
		<DetailsForm
			bind:building={editedBuilding}
			bind:coldFinish
			bind:warmFinish
			bind:allYearFinish
			bind:allYear150Finish
			bind:allYear200Finish
		/>
	</div>
	{#if uploadError}
		<h4 class="text-center text-lg text-red-500">Ошибка</h4>
		<p class="mt-4 text-center text-red-400">{uploadError}</p>
	{/if}
	{#if uploadSuccess}
		<h4 class="text-center text-lg text-green-600">Строение было успешно обновлено!</h4>
	{/if}
	<button
		onclick={handleSubmit}
		class="bg-dark-brown text-off-white mx-auto block rounded-2xl px-6 py-2 text-xl">Готово</button
	>
</section>
