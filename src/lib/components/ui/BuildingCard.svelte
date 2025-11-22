<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<div
	class="border-light-olive bg-off-white flex w-[clamp(300px,100%,400px)] min-w-0 shrink flex-col items-center rounded-2xl border-2 p-4 transition hover:scale-105"
>
	<img src="images/hero-image-upscale.jpg" alt="" height="230" class="rounded-2xl" />
	<h4 class="mt-6 text-xl font-medium max-[600px]:text-lg">Дом 8,5х11,5 Виталина</h4>
	<div class="border-light-olive mt-2 h-px w-24 border"></div>
	<div class="mt-6 grid grid-cols-2 gap-2.5 gap-x-8 px-4">
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="ix:align-object-dimensions" class="size-8 min-w-6" /><span
				class="max-[600px]:text-md text-lg">Габариты: 6х4</span
			>
		</p>
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="mdi:bathroom" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Санузелов: 2</span
			>
		</p>
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="bx:area" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Площадь: 24 м<sup>2</sup></span
			>
		</p>
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="uil:bed" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Комнат: 2</span
			>
		</p>
	</div>
	<p class="mt-8 text-xl font-medium max-[600px]:text-lg">От 340 000 руб.</p>
	<a
		href="/catalog"
		class="bg-dark-brown text-off-white hover:bg-dark-olive mt-4 inline-block rounded-2xl px-8 py-2 transition"
		>Подробнее</a
	>
</div>
