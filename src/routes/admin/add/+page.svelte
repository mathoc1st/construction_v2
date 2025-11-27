<script lang="ts">
	import DetailsEditor from '$lib/components/ui/admin/DetailsEditor.svelte';
	import FinishesEditor from '$lib/components/ui/admin/FinishesEditor.svelte';
	import ImageEditor from '$lib/components/ui/admin/ImageEditor.svelte';
	import { buildingSchema, finishSchema, type BuildingDto, type FinishDto } from '$lib/types';
	import z, { ZodError } from 'zod';

	let savedBuilding: BuildingDto = $state({});
	let images: File[] = $state([]);
	let savedFinishes: FinishDto[] = $state([]);

	let uploadError: string | null = $state(null);
	let uploadSuccess: boolean = $state(false);

	function handleSaveBuilding(building: BuildingDto) {
		const result = buildingSchema.safeParse(building);

		if (!result.success) {
			return;
		}

		savedBuilding = building;
	}
	function handleSaveFinishes(finishes: FinishDto[]) {
		for (const finish of finishes) {
			const result = finishSchema.safeParse(finish);
			if (!result.success) return;
		}

		savedFinishes = finishes;
	}
	function handleChangeImages(files: File[]) {
		images = files;
	}

	async function handleSubmit() {
		const formData = new FormData();

		images.forEach((i) => formData.append('image', i));
		formData.append('building', JSON.stringify(savedBuilding));
		// formData.append(
		// 	'finishes',
		// 	JSON.stringify([coldFinish, warmFinish, allYearFinish, allYear150Finish, allYear200Finish])
		// );

		const responce = await fetch(`/api/building`, {
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

<section class="mx-auto flex max-w-[1440px] gap-6 px-5 py-20 max-[1100px]:flex-col">
	<ImageEditor onChangeImages={handleChangeImages} />
	<div class="flex basis-1/2 flex-col gap-8 max-[1300px]:items-center">
		<DetailsEditor onSaveBuilding={handleSaveBuilding} />
		<FinishesEditor onSaveFinishes={handleSaveFinishes} />
	</div>
</section>

<!-- <section class="mt-26 mb-26">
	<div class="flex gap-6 max-[1300px]:flex-col">
		
		<div>
			<DetailsEditor />
			<FinishesEditor {onSaveFinishes} />
		</div>
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
</section> -->
