<script>
	import Icon from '@iconify/svelte';

	import { Tabs, TabItem } from 'flowbite-svelte';
</script>

<div class="flex flex-col justify-center max-[1300px]:items-center">
	<h2
		class="text-dark-olive text-4xl font-medium max-[1300px]:mt-4 max-[1300px]:text-center max-[600px]:text-3xl"
	>
		Дом 8,5х11,5 Виталина
	</h2>
	<div class="border-light-olive bg-light-olive mt-4 h-px w-40 border"></div>
	<h4 class="text-dark-olive mt-6 text-3xl max-[600px]:text-2xl">Паспорт объекта</h4>
	<div class="place-i mt-6 grid grid-cols-2 gap-2.5 gap-x-8">
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
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="ri:stairs-line" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Этажность: 1</span
			>
		</p>
		<p class="text-dark-olive flex items-center gap-1">
			<Icon icon="mdi:veranda" class="size-8 min-w-6" /><span class="max-[600px]:text-md text-lg"
				>Веранда: есть</span
			>
		</p>
	</div>

	<h4 class="text-dark-olive mt-14 mb-8 text-3xl">Комплектация</h4>
	<Tabs
		tabStyle="underline"
		classes={{
			active: 'bg-light-brown max-[650px]:w-full border-light-olive',
			divider: 'bg-light-olive'
		}}
		ulClass="max-[650px]:flex-col max-[650px]:w-full"
	>
		<TabItem open inactiveClass="hover:bg-dark-olive rounded-t-lg h-full group w-full p-4">
			{#snippet titleSlot()}
				<div class="flex items-center gap-1 max-[650px]:justify-center">
					<Icon
						icon="hugeicons:thermometer-cold"
						class="text-dark-olive group-hover:text-off-white size-8"
					/>
					<p class="text-dark-olive group-hover:text-off-white text-lg">Холодный контур</p>
				</div>
			{/snippet}
			<div>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="ic:round-check-circle-outline"
						class="text-dark-brown size-6 shrink-0"
					/>Размер: 8х12,5
				</p>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="ic:round-check-circle-outline"
						class="text-dark-brown size-6 shrink-0"
					/>Каркас: брус 40×100 мм
				</p>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="ic:round-check-circle-outline"
						class="text-dark-brown size-6 shrink-0"
					/>Наружная отделка: вагонка АВ
				</p>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="ic:round-check-circle-outline"
						class="text-dark-brown size-6 shrink-0"
					/>Ветро-влагозащита: есть
				</p>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="ic:round-check-circle-outline"
						class="text-dark-brown size-6 shrink-0"
					/>Входная дверь: металлическая (РФ), 1 шт
				</p>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="ic:round-check-circle-outline"
						class="text-dark-brown size-6 shrink-0"
					/>Кровля: профнастил цветной 0,4 мм
				</p>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="ic:round-check-circle-outline"
						class="text-dark-brown size-6 shrink-0"
					/>Обрешетки и черновой пол: доска 100×25 мм
				</p>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="ic:round-check-circle-outline"
						class="text-dark-brown size-6 shrink-0"
					/>Обвязка: брус 150×100 мм
				</p>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="material-symbols:cancel-outline-rounded"
						class="text-light-olive size-6 shrink-0"
					/>Утеплитель: отсутствует
				</p>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="material-symbols:cancel-outline-rounded"
						class="text-light-olive size-6 shrink-0"
					/>Внутренняя отделка: отсутствует
				</p>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="material-symbols:cancel-outline-rounded"
						class="text-light-olive size-6 shrink-0"
					/>Парогидроизоляция: отсутствует
				</p>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="material-symbols:cancel-outline-rounded"
						class="text-light-olive size-6 shrink-0"
					/>Окна: отсутствуют
				</p>
				<p class="flex items-center gap-2 text-lg">
					<Icon
						icon="material-symbols:cancel-outline-rounded"
						class="text-light-olive size-6 shrink-0"
					/>Полы: отсутствуют
				</p>
				<div class="mt-6 flex flex-col gap-4 max-[1300px]:items-center">
					<h4 class="w-max rounded-2xl text-xl font-medium">Цена: 1 350 000 ₽</h4>
					<button
						class="bg-dark-brown text-off-white hover:bg-dark-olive h-max w-max rounded-2xl px-8 py-4 text-xl font-medium"
						>Заказать</button
					>
				</div>
			</div>
		</TabItem>
		<TabItem inactiveClass="hover:bg-dark-olive rounded-t-lg h-full group w-full p-4">
			{#snippet titleSlot()}
				<div class="flex items-center gap-1 max-[650px]:justify-center">
					<Icon
						icon="hugeicons:thermometer-warm"
						class="text-dark-olive group-hover:text-off-white size-8 text-lg"
					/>
					<p class="text-dark-olive group-hover:text-off-white text-lg">Теплый контур</p>
				</div>
			{/snippet}
			<p class="max-w-[545px] text-sm text-gray-500 dark:text-gray-400">
				<b>Dashboard:</b>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua.
			</p>
		</TabItem>
		<TabItem inactiveClass="hover:bg-dark-olive rounded-t-lg h-full group w-full p-4">
			{#snippet titleSlot()}
				<div class="flex items-center gap-1 max-[650px]:justify-center">
					<Icon icon="ph:house-line" class="text-dark-olive group-hover:text-off-white size-8" />
					<p class="text-dark-olive group-hover:text-off-white text-lg">ПМЖ</p>
				</div>
			{/snippet}
			<p class="max-w-[545px] text-base">
				<b>Settings:</b>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua.
			</p>
		</TabItem>
	</Tabs>
</div>

<style>
	:global([role='tabpanel']) {
		background-color: transparent;
	}
</style>
