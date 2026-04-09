<script lang="ts">
	import Icon from '@iconify/svelte';
	import { tv } from 'tailwind-variants';
	import { Textarea, Toast, ToastContainer } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms/client';
	import ImageEditor from './ImageEditor.svelte';
	import { ConstructionType } from '$lib/types/buildings/building.domain.types';
	import { FinishType } from '$lib/types/finishes/finish.domain.types';
	import type { ListingDto } from '$lib/dtos/listing.dto';
	import type { ImageDto } from '$lib/dtos/image.dto';
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const lable = tv({
		variants: {
			input: {
				checkbox: 'text-dark-olive flex w-full items-center gap-1.5 max-[450px]:flex-col',
				text: 'text-dark-olive flex w-full flex-col justify-between gap-1 max-[1300px]:max-w-full max-[600px]:max-w-[70%] max-[450px]:flex-col'
			}
		}
	});
	const input = tv({
		variants: {
			type: {
				text: 'text-dark-olive placeholder:text-light-olive caret-dark-olive border-light-olive focus:border-dark-brown focus:ring-dark-brown form-input w-fit rounded-2xl bg-transparent',
				checkbox:
					'text-dark-brown border-light-brown focus:border-dark-brown focus:ring-dark-brown bg-off-white mt-0.5 form-checkbox size-5 rounded'
			},
			state: {
				default: '',
				error: 'border-red-500 focus:border-red-500 focus:ring-red-500'
			}
		},
		defaultVariants: {
			state: 'default'
		}
	});

	interface Props {
		data: {
			form: SuperValidated<ListingDto>;
		};
	}

	let { data }: Props = $props();

	const { form, errors, enhance } = superForm(data.form, {
		dataType: 'json',
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				addToast('green');
				setTimeout(() => {
					goto(resolve(`/listing/${$form.id}`));
				}, 1000);
			} else if (result.type === 'error') {
				addToast('red');
			} else {
				addToast('yellow');
			}
		}
	});

	let selectedFinish: FinishType = $state(FinishType.COLD);

	type ToastColor = 'green' | 'red' | 'yellow' | 'blue';

	interface ToastItem {
		id: number;
		message: string;
		color: ToastColor;
		timeoutId?: ReturnType<typeof setTimeout>;
		visible: boolean;
	}

	let toasts = $state<ToastItem[]>([]);
	let nextId = $state(1);

	const messages: Record<ToastColor, string> = {
		green: 'Сохранено!',
		blue: 'New message received',
		yellow: 'Неправильные данные в форме',
		red: 'При сохранении произошла ошибка'
	};

	function addToast(color?: ToastColor, message?: string) {
		const selectedColor =
			color || (['green', 'blue', 'yellow', 'red'][Math.floor(Math.random() * 4)] as ToastColor);
		const newToast: ToastItem = {
			id: nextId,
			message: message || messages[selectedColor],
			color: selectedColor,
			visible: true
		};

		// Auto-dismiss after 5 seconds
		const timeoutId = setTimeout(() => {
			dismissToast(newToast.id);
		}, 5000);
		newToast.timeoutId = timeoutId;

		toasts = [...toasts, newToast];
		nextId++;
	}

	function dismissToast(id: number) {
		// Clear timeout if it exists
		const toast = toasts.find((t) => t.id === id);
		if (toast?.timeoutId) {
			clearTimeout(toast.timeoutId);
		}

		// Set visible to false to trigger outro transition
		toasts = toasts.map((t) => (t.id === id ? { ...t, visible: false } : t));

		setTimeout(() => {
			toasts = toasts.filter((t) => t.id !== id);
		}, 300); // Slightly longer than transition duration
	}

	function handleClose(id: number) {
		return () => {
			dismissToast(id);
		};
	}

	onDestroy(() => {
		// Clear all pending timeouts on unmount
		toasts.forEach((toast) => {
			if (toast.timeoutId) {
				clearTimeout(toast.timeoutId);
			}
		});
	});

	function getConstructionTypeName(type: ConstructionType): string {
		switch (type) {
			case ConstructionType.FRAME:
				return 'Каркасный';
			case ConstructionType.BARN:
				return 'Барнхаус';
			case ConstructionType.CONTAINER:
				return 'Бытовка';
		}
	}

	function getFinishTypeName(type: FinishType): string {
		switch (type) {
			case FinishType.COLD:
				return 'Холодный контур';
			case FinishType.WARM_100:
				return 'Теплый контур 100мм';
			case FinishType.WARM_150:
				return 'Теплый контур 150мм';
			case FinishType.WARM_200:
				return 'Теплый контур 200мм';
		}
	}

	let imagesState = $state<ImageDto[]>($form.images ?? []);

	$effect(() => {
		$form.images = imagesState;
	});
</script>

<ToastContainer position="top-right">
	{#each toasts as toast (toast.id)}
		<Toast
			color={toast.color}
			dismissable={true}
			transition={fly}
			params={{ x: 200, duration: 800 }}
			class="w-64"
			onclose={handleClose(toast.id)}
			bind:toastStatus={toast.visible}
		>
			{toast.message}
		</Toast>
	{/each}
</ToastContainer>

<form
	class="mx-auto flex max-w-360 gap-6 px-5 py-20 max-[1100px]:flex-col"
	method="POST"
	enctype="multipart/form-data"
	use:enhance
>
	<ImageEditor bind:images={imagesState} />

	<div class="flex basis-1/2 flex-col justify-center gap-8 max-[1300px]:items-center">
		<input
			class={input({
				type: 'text',
				state: $errors?.title ? 'error' : 'default'
			})}
			placeholder="Название"
			name="listingTitle"
			id="listingTitle"
			bind:value={$form.title}
			required
			autocomplete="off"
		/>

		<div class="border-light-olive bg-light-olive mt-4 h-px w-40 border"></div>

		<h4 class="text-dark-olive mt-6 text-3xl max-[600px]:text-2xl">Паспорт объекта</h4>

		<div class="relative mb-4 flex max-w-max flex-col">
			<label
				for="buildingConstructionType"
				class="text-dark-olive mt-7 text-2xl font-normal max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-xl"
				>Тип сроения</label
			>
			<select
				class="text-dark-olive mt-4 form-multiselect rounded-2xl bg-transparent pr-8"
				id="buildingConstructionType"
				name="buildingConstructionType"
				bind:value={$form.building.constructionType}
				autocomplete="off"
				required
			>
				{#each Object.values(ConstructionType) as constructionType (constructionType)}
					<option value={constructionType}>{getConstructionTypeName(constructionType)}</option>
				{/each}
			</select>
		</div>

		<div class="mt-6 grid grid-cols-2 place-items-start gap-5 max-[600px]:grid-cols-1">
			<div class="flex flex-col gap-2">
				<lable class={lable({ input: 'text' })}>
					<p class="text-left text-lg">Длина</p>
					<input
						type="number"
						name="buildingLength"
						id="buildingLength"
						placeholder="Длина"
						class={input({
							type: 'text',
							state: $errors.building?.length ? 'error' : 'default'
						})}
						bind:value={$form.building.length}
						required
						autocomplete="off"
					/>
				</lable>
				<lable class={lable({ input: 'text' })}>
					<p class="text-left text-lg">Ширина</p>
					<input
						type="number"
						name="buildingWidth"
						id="buildingWidth"
						placeholder="Ширина"
						class={input({
							type: 'text',
							state: $errors.building?.width ? 'error' : 'default'
						})}
						bind:value={$form.building.width}
						required
						autocomplete="off"
					/>
				</lable>
				<lable class={lable({ input: 'text' })}>
					<p class="text-left text-lg">Высота</p>
					<input
						type="number"
						name="buildingHeight"
						id="buildingHeight"
						placeholder="Высота"
						class={input({
							type: 'text',
							state: $errors.building?.height ? 'error' : 'default'
						})}
						bind:value={$form.building.height}
						required
						autocomplete="off"
					/>
				</lable>
			</div>
			<lable class={lable({ input: 'text' })}>
				<p class="flex items-center gap-1">
					<Icon icon="mdi:bathroom" class="size-8 min-w-6" /><span
						class="max-[600px]:text-md text-lg">Санузлы</span
					>
				</p>
				<input
					type="number"
					name="buildingBathrooms"
					id="buildingBathrooms"
					placeholder="0"
					class={input({
						type: 'text',
						state: $errors.building?.bathrooms ? 'error' : 'default'
					})}
					bind:value={$form.building.bathrooms}
					required
					autocomplete="off"
				/>
			</lable>

			<lable class={lable()}>
				<p class="flex items-center gap-1">
					<Icon icon="ri:stairs-line" class="size-8 min-w-6" /><span
						class="max-[600px]:text-md text-lg">Этажность</span
					>
				</p>
				<input
					type="number"
					name="buildingFloors"
					id="buildingFloors"
					placeholder="0"
					class={input({
						type: 'text',
						state: $errors.building?.floors ? 'error' : 'default'
					})}
					required
					bind:value={$form.building.floors}
					autocomplete="off"
				/>
			</lable>
			<lable class={lable()}>
				<p class="flex items-center gap-1">
					<Icon icon="uil:bed" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
						>Комнат</span
					>
				</p>
				<input
					type="number"
					name="buildingBedrooms"
					id="buildingBedrooms"
					placeholder="0"
					class={input({
						type: 'text',
						state: $errors.building?.bedrooms ? 'error' : 'default'
					})}
					bind:value={$form.building.bedrooms}
					required
					autocomplete="off"
				/>
			</lable>
			<lable class={lable({ input: 'checkbox' })}>
				<p class="flex items-center gap-1">
					<Icon icon="mdi:veranda" class="size-8 min-w-6" /><span
						class="max-[600px]:text-md text-lg">Веранда:</span
					>
				</p>
				<input
					type="checkbox"
					name="buildingVeranda"
					id="buildingVeranda"
					class={input({ type: 'checkbox' })}
					bind:checked={$form.building.hasVeranda}
					autocomplete="off"
				/>
			</lable>
		</div>
		<label
			for="finish"
			class="text-dark-olive mt-7 text-2xl font-medium max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-xl"
			>Комплектация</label
		>

		<div>
			<select
				class="text-dark-olive mt-4 rounded-2xl bg-transparent disabled:cursor-not-allowed!"
				id="finish"
				name="finish"
				bind:value={selectedFinish}
				required
			>
				{#each Object.values(FinishType) as finishType (finishType)}
					<option value={finishType}>{getFinishTypeName(finishType)}</option>
				{/each}
			</select>

			{#if $form.building.finishes.some((finish) => finish.type === selectedFinish)}
				<button
					onclick={() => {
						$form.building.finishes = $form.building.finishes.filter(
							(finish) => finish.type !== selectedFinish
						);
					}}
					type="button"
					class="bg-dark-brown text-off-white hover:bg-light-brown ml-2 w-max rounded-xl px-[0.900rem] py-1 text-lg"
					>-</button
				>
			{:else}
				<button
					onclick={() => {
						$form.building.finishes = [
							...$form.building.finishes,
							{ type: selectedFinish, description: '', price: 0 }
						];
					}}
					type="button"
					class="bg-dark-olive text-off-white hover:bg-light-brown ml-2 w-max rounded-xl px-3 py-1 text-lg"
					>+</button
				>
			{/if}
		</div>

		{#each $form.building.finishes as finish (finish.type)}
			{#if finish.type === selectedFinish}
				<Textarea
					divClass="w-3/4 max-[450px]:w-[90%] min-h-64 *:w-full *:h-full"
					bind:value={finish.description}
					name={`finish${selectedFinish}Description`}
				></Textarea>
				<lable class={lable()}>
					<p class="mb-5 text-left text-lg">Цена</p>
					<input
						type="number"
						name={`finish${selectedFinish}Price`}
						id={`finish${selectedFinish}Price`}
						placeholder="0"
						class={input({ type: 'text' })}
						required
						bind:value={finish.price}
						autocomplete="off"
					/>
				</lable>
			{/if}
		{/each}

		<button
			type="submit"
			class="bg-dark-olive text-off-white hover:bg-light-brown mt-8 w-max rounded-2xl p-2 text-lg"
			>Сохранить</button
		>
	</div>
</form>
