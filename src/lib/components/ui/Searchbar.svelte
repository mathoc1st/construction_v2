<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { ClassValue } from 'svelte/elements';

	let {
		search = $bindable(),
		placeholder,
		class: className
	}: { search: string; placeholder: string; class: ClassValue } = $props();
</script>

<div class={['flex items-stretch', className]}>
	<label for="search" class="sr-only">Телефон</label>
	<div class=" border-light-olive flex items-center rounded-l-2xl border-2 border-r-0 pl-2">
		<Icon icon="material-symbols:search-rounded" class="text-light-olive  size-10" />
	</div>
	<div class="relative">
		<input
			bind:value={search}
			name="search"
			type="text"
			{placeholder}
			class="border-light-olive text-dark-olive rounded-r-2xl border-2 bg-transparent px-4 py-4 text-xl max-[600px]:text-base"
		/>
		<div
			class="text-light-olive bg-light-olive absolute bottom-3 left-1/2 mt-4 h-px w-[89%] -translate-x-1/2 border"
		></div>
	</div>
</div>
