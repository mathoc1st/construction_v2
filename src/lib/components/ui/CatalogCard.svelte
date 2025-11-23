<script lang="ts">
	let { src, type }: { src: string; type: string } = $props();
</script>

<a
	href={`/catalog/${type}`}
	class="border-light-olive group block rounded-2xl border-2 p-1 transition hover:scale-105"
>
	<h3 class="text-dark-olive mt-4 text-center text-3xl font-medium max-[600px]:text-2xl">
		Каркасные дома
	</h3>
	<div class="border-light-olive mx-auto mt-4 h-px w-28 border transition group-hover:w-32"></div>
	<img
		{src}
		alt=""
		class="h-[280px] max-w-[350px] object-contain object-center max-[600px]:h-[200px] max-[600px]:w-[300px]"
	/>
</a>
