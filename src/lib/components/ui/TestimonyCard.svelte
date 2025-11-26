<script lang="ts">
	import Icon from '@iconify/svelte';

	let {
		text,
		name,
		date,
		building,
		picture
	}: { text: string; name: string; date: string; building: string; picture: string } = $props();
</script>

<div class="border-light-olive group relative flex flex-col items-center rounded-2xl border-2 p-6">
	<img src="images/flower3.svg" alt="" class="absolute -top-8 -left-5 group-not-first:hidden" />
	<img
		src="images/flower4.svg"
		alt=""
		class="absolute -right-15 bottom-0 group-not-last:hidden max-[600px]:-right-5 max-[600px]:size-20"
	/>
	<img
		src={picture}
		onerror={(e: Event) => {
			const img = e.target as HTMLImageElement;
			img.src = '/images/placeholder.jpg';
		}}
		alt=""
		class="border-light-olive size-32 min-h-32! min-w-32! rounded-full border-2"
	/>
	<h4 class="text-dark-olive mt-4 text-xl font-medium max-[600px]:text-lg">{name}</h4>
	<div class="border-light-olive mt-4 h-px w-24 border"></div>
	<p class="text-light-olive mt-4 max-[600px]:text-sm">Москва</p>
	<p class="text-light-olive max-w-[250px] text-center max-[600px]:text-sm">{building}</p>
	<p class="text-dark-olive mt-6 max-w-80 text-center text-lg">
		{text}
	</p>
	<div class="flex h-full flex-col justify-end">
		<div class="mt-8 flex gap-2">
			{#each { length: 5 }}
				<Icon icon="material-symbols:star-rounded" class="text-dark-brown size-9" />
			{/each}
		</div>
		<p class="text-light-olive mt-6 text-center max-[600px]:text-sm">{date} 2025</p>
	</div>
</div>
