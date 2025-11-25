<script lang="ts">
	import { SortBy } from '$lib/types';
	import Icon from '@iconify/svelte';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';

	let { sortBy = $bindable() }: { sortBy: SortBy } = $props();

	let isOpen: boolean = $state(false);
</script>

<button
	class={[
		'hover:bg-light-brown hover:text-dark-olive bg-dark-olive text-off-white rounded-2xl px-6 py-2 text-xl transition max-[600px]:text-lg',
		{ 'bg-light-brown text-dark-olive!': isOpen }
	]}>Сортировать</button
>
<Dropdown bind:isOpen simple class="bg-light-brown">
	<DropdownItem class="hover:bg-dark-olive"
		><button
			onclick={() => {
				sortBy = sortBy === SortBy.POPULARITY_ASC ? SortBy.POPULARITY_DESC : SortBy.POPULARITY_ASC;
			}}
			class="text-off-white flex h-full w-full items-center text-base"
			>По популярности <Icon
				icon="flowbite:arrow-up-outline"
				rotate={sortBy === SortBy.POPULARITY_ASC ? 0 : 90}
			/></button
		>
	</DropdownItem>
	<DropdownItem class="hover:bg-dark-olive">
		<button
			onclick={() => {
				sortBy = sortBy === SortBy.PRICE_ASC ? SortBy.PRICE_DESC : SortBy.PRICE_ASC;
			}}
			class="text-off-white flex h-full w-full items-center text-base"
			>По цене <Icon
				icon="flowbite:arrow-up-outline"
				rotate={sortBy === SortBy.PRICE_ASC ? 0 : 90}
			/></button
		></DropdownItem
	>
</Dropdown>
