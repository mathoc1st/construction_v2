<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import DetailsForm from '$lib/components/ui/DetailsForm.svelte';
	import Finishes from '$lib/components/ui/Finishes.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import { FinishType, type FinishDto } from '$lib/types';
	import { type ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let selectedFiles: File[] = $state([]);

	let coldFinish: FinishDto = $state({ type: FinishType.COLD, price: 0, options: [] });
	let warmFinish: FinishDto = $state({ type: FinishType.WARM, price: 0, options: [] });
	let allYearFinish: FinishDto = $state({ type: FinishType.ALL_YEAR, price: 0, options: [] });
</script>

<section class="mt-26 mb-26">
	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			formData.delete('option');
			for (const file of selectedFiles) {
				formData.append('images', file);
			}

			formData.append(FinishType.COLD, JSON.stringify(coldFinish));
			formData.append(FinishType.WARM, JSON.stringify(warmFinish));
			formData.append(FinishType.ALL_YEAR, JSON.stringify(allYearFinish));

			return async ({ result, update }) => {
				if (result.type === 'success') {
					selectedFiles = [];
					await update({ reset: true });
				} else {
					await applyAction(result);
				}
			};
		}}
	>
		<div class="flex gap-6 max-[1300px]:flex-col">
			<ImageUploader bind:selectedFiles />
			<DetailsForm bind:coldFinish bind:warmFinish bind:allYearFinish />
			<Finishes />
		</div>

		<div class="mt-8 w-full">
			{#if form?.message}
				<p class="block text-center text-red-500">Ошибка: {form.message}</p>
			{/if}

			<button
				type="submit"
				class="bg-dark-brown text-off-white mx-auto mt-2 block rounded-2xl px-8 py-2 text-xl"
				>Готово</button
			>
		</div>
	</form>
</section>
