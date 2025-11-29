<script>
	import Icon from '@iconify/svelte';
</script>

<section class="mx-auto mt-46 mb-46 max-w-[1440px] px-5">
	<h1 class="text-center text-5xl max-[600px]:text-4xl">Остались вопросы?</h1>
	<h3 class="text-center text-3xl max-[600px]:text-2xl">
		Заполните форму ниже и мы на них ответим
	</h3>
	<div class=" flex flex-wrap items-center justify-center gap-8">
		<form action="" class="mt-36 flex flex-col gap-2">
			<div class="relative flex items-stretch">
				<img src="images/stick.svg" alt="" class="absolute -top-30" />
				<label for="name" class="sr-only">Имя</label>
				<div class="bg-light-olive z-10 flex items-center rounded-l-2xl pl-3">
					<Icon icon="icon-park-outline:edit-name" class="text-off-white size-10" />
				</div>
				<div class="relative">
					<input
						name="name"
						type="text"
						placeholder="Ваше имя"
						class="text-off-white bg-light-olive rounded-r-2xl border-0 px-4 py-4 text-xl max-[600px]:text-base"
					/>
					<div
						class="text-off-white bg-off-white absolute bottom-3 left-1/2 mt-4 h-px w-[89%] -translate-x-1/2 border"
					></div>
				</div>
			</div>
			<div class=" flex items-stretch">
				<label for="email" class="sr-only">Почта</label>
				<div class="bg-light-olive flex items-center rounded-l-2xl pl-3">
					<Icon icon="material-symbols:mail-outline" class="text-off-white size-10" />
				</div>
				<div class="relative">
					<input
						name="email"
						type="email"
						placeholder="Почта"
						class="text-off-white bg-light-olive rounded-r-2xl border-0 px-4 py-4 text-xl max-[600px]:text-base"
					/>
					<div
						class="text-off-white bg-off-white absolute bottom-3 left-1/2 mt-4 h-px w-[89%] -translate-x-1/2 border"
					></div>
				</div>
			</div>
			<div class=" flex items-stretch">
				<label for="phone" class="sr-only">Телефон</label>
				<div class="bg-light-olive flex items-center rounded-l-2xl pl-3">
					<Icon icon="line-md:phone" class="text-off-white size-10" />
				</div>
				<div class="relative">
					<input
						name="phone"
						type="tel"
						placeholder="Телефон"
						class="text-off-white bg-light-olive rounded-r-2xl border-0 px-4 py-4 text-xl max-[600px]:text-base"
					/>
					<div
						class="text-off-white bg-off-white absolute bottom-3 left-1/2 mt-4 h-px w-[89%] -translate-x-1/2 border"
					></div>
				</div>
			</div>
			<div class="flex items-stretch" id="contacts">
				<label for="message" class="sr-only">Сообщение</label>
				<div class="bg-light-olive flex items-start rounded-l-2xl pt-2 pl-3">
					<Icon icon="solar:pen-linear" class="text-off-white size-10" />
				</div>
				<textarea
					placeholder="Сообщение"
					name="message"
					class="text-off-white bg-light-olive min-h-64 w-96 resize-none rounded-r-2xl border-0 border-none px-4 py-4 text-xl max-[600px]:w-64 max-[600px]:text-lg"
				></textarea>
			</div>
			<button
				type="submit"
				class="bg-dark-brown text-off-white hover:bg-dark-olive w-max rounded-2xl px-12 py-3 text-xl transition"
				>Отправить</button
			>
		</form>
		<div
			class="border-light-olive relative mb-15 flex flex-col gap-3 self-end rounded-2xl border-2 py-8 pr-16 pl-6 max-[600px]:pr-10"
		>
			<img
				src="images/leaf6.svg"
				alt=""
				class="absolute top-0 -right-28 max-[600px]:top-15 max-[600px]:-right-16 max-[600px]:size-20 max-[450px]:hidden"
			/>
			<div>
				<h3 class="text-3xl max-[600px]:text-2xl">Наши контакты</h3>
				<div class="border-light-olive mt-4 h-px w-24 border"></div>
			</div>

			<p class="text-dark-olive relative flex text-xl max-[600px]:text-base">
				<Icon icon="line-md:phone" class="size-7" /><span class="mr-2 font-medium">Телефон:</span> +7
				991 620-18-67
			</p>
			<p class="text-dark-olive flex text-xl max-[600px]:text-base">
				<Icon icon="material-symbols:mail-outline" class="size-7" /><span class="mr-2 font-medium"
					>Почта:</span
				> отсутствует
			</p>
			<p class="text-dark-olive flex text-xl max-[600px]:text-base">
				<Icon icon="tabler:clock" class="size-7" /><span class="mr-2 font-medium">Часы работы:</span
				> 9:00–18:00
			</p>
			<p class="text-dark-olive flex max-w-[400px] text-xl max-[600px]:text-base">
				<Icon icon="mingcute:location-line" class="size-7 shrink-0 " /><span
					class="mr-2 font-medium">Адрес:</span
				>Москва, Новомосковский административный округ, р-н Коммунарка, ул. Адмирала Корнилова,
				63Б/1
			</p>
		</div>
	</div>
</section>
