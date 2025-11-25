<script lang="ts">
	import DetailsForm from '$lib/components/ui/DetailsForm.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import { FinishType, type BuildingDto, type FinishDto, type ImageDto } from '$lib/types';

	let building: BuildingDto = $state({});
	let images: File[] = $state([]);
	let coldFinish: FinishDto = $state({ type: FinishType.COLD });
	let warmFinish: FinishDto = $state({ type: FinishType.WARM });
	let allYearFinish: FinishDto = $state({ type: FinishType.ALL_YEAR });

	let uploadError: string | null = $state(null);
	let uploadSuccess: boolean = $state(false);

	async function handleSubmit() {
		const params = new URLSearchParams();
		params.append('action', 'create');

		const formData = new FormData();

		images.forEach((i) => formData.append('image', i));
		formData.append('building', JSON.stringify(building));
		formData.append('finishes', JSON.stringify([coldFinish, warmFinish, allYearFinish]));

		const responce = await fetch(`/api/building?${params}`, {
			method: 'POST',
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
	}
</script>

<section class="mt-26 mb-26">
	<div class="flex gap-6 max-[1300px]:flex-col">
		<ImageUploader bind:images />
		<DetailsForm bind:building bind:coldFinish bind:warmFinish bind:allYearFinish />
	</div>
	{#if uploadError}
		<h4 class="text-center text-lg text-red-500">Ошибка</h4>
		<p class="mt-4 text-center text-red-400">{uploadError}</p>
	{/if}
	{#if uploadSuccess}
		<h4 class="text-center text-lg text-green-600">Новое строение было успешно добавлено!</h4>
	{/if}
	<button
		onclick={handleSubmit}
		class="bg-dark-brown text-off-white mx-auto block rounded-2xl px-6 py-2 text-xl">Готово</button
	>
</section>
