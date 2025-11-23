<script>
	import Icon from '@iconify/svelte';
</script>

<div class="border-light-olive group relative flex flex-col items-center rounded-2xl border-2 p-6">
	<img src="images/flower3.svg" alt="" class="absolute -top-8 -left-5 group-not-first:hidden" />
	<img
		src="images/flower4.svg"
		alt=""
		class="absolute -right-15 bottom-0 group-not-last:hidden max-[600px]:-right-5 max-[600px]:size-20"
	/>
	<img
		src="https://randomuser.me/api/portraits/men/41.jpg"
		alt=""
		class="border-light-olive size-32 rounded-full border-2"
	/>
	<h4 class="text-dark-olive mt-4 text-xl font-medium max-[600px]:text-lg">Алексей Покров</h4>
	<div class="border-light-olive mt-4 h-px w-24 border"></div>
	<p class="text-dark-olive mt-4 max-[600px]:text-sm">Москва</p>
	<p class="text-dark-olive max-[600px]:text-sm">Каркасный Дом</p>
	<p class="text-dark-olive mt-6 max-w-80 text-center text-lg max-[600px]:text-base">
		Мой опыт сотрудничества с компанией «Компания» исключительно положительный: заказывал
		строительство дома «под ключ». Изначально планировал свой проект, но мне предложили такое
		коли...
	</p>
	<div class="mt-8 flex gap-2">
		{#each { length: 5 }}
			<Icon icon="material-symbols:star-rounded" class="text-dark-brown size-9" />
		{/each}
	</div>
	<p class="text-dark-olive mt-6 max-[600px]:text-sm">1 Сентября 2025</p>
</div>
