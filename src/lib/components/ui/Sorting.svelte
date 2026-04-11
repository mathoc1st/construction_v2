<script lang="ts">
	import { type SortOptionsV2 } from '$lib/types/listings/listings.repository.types';
	import { SortDirection } from '$lib/types/prisma/prisma.service.types';
	import Icon from '@iconify/svelte';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';

	let {
		sortBy,
		onSortByChanged
	}: { sortBy: SortOptionsV2; onSortByChanged(sort: 'views' | 'price'): Promise<void> } = $props();

	let isOpen: boolean = $state(false);

	function changeSortByPopularity() {
		onSortByChanged('views');
	}

	function changeSortByPrice() {
		onSortByChanged('price');
	}
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
			onclick={changeSortByPopularity}
			class="text-off-white flex h-full w-full items-center text-base"
			>По популярности <Icon
				icon="flowbite:arrow-up-outline"
				rotate={sortBy.views && sortBy.views === SortDirection.ASC ? 0 : 90}
			/></button
		>
	</DropdownItem>
	<DropdownItem class="hover:bg-dark-olive">
		<button
			onclick={changeSortByPrice}
			class="text-off-white flex h-full w-full items-center text-base"
			>По цене <Icon
				icon="flowbite:arrow-up-outline"
				rotate={sortBy.price && sortBy.price === SortDirection.ASC ? 0 : 90}
			/></button
		></DropdownItem
	>
</Dropdown>
