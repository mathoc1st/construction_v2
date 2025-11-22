<script>
	import Icon from '@iconify/svelte';
</script>

<section class="bg-light-brown relative mt-36 mb-26 w-screen overflow-hidden">
	<img src="images/leaf5.svg" alt="" class="absolute top-0 left-0" />

	<div class="relative z-10 mx-auto mb-16 max-w-[1440px] px-5">
		<h1 class="text-off-white mt-26 text-center text-5xl font-medium max-[600px]:text-4xl">
			Готовы построить дом вашей мечты?
		</h1>
		<h3 class="text-off-white mx-auto mt-12 max-w-3xl text-center text-2xl max-[600px]:text-xl">
			Свяжитесь с нами сегодня, чтобы получить бесплатную смету и профессиональную консультацию.
		</h3>
		<form action="" class="mt-18 flex flex-col items-center">
			<div class="flex w-max max-w-full items-stretch">
				<label for="phone" class="sr-only">Телефон</label>
				<div
					class="border-dark-olive flex items-center rounded-l-2xl border-t-2 border-b-2 border-l-2 px-2"
				>
					<Icon icon="el:phone-alt" class="text-dark-olive size-10" />
				</div>
				<div class="max-w-f relative">
					<input
						type="tel"
						name="phone"
						id="phone"
						placeholder="+7"
						class="border-dark-olive text-off-white h-20 rounded-r-2xl border-2 bg-transparent px-4 text-2xl max-[600px]:text-lg max-[400px]:text-base"
					/>
					<div
						class="border-dark-olive absolute bottom-4 left-1/2 mt-4 h-px w-[90%] -translate-x-1/2 border"
					></div>
				</div>
			</div>
			<div class="group relative mt-10">
				<img src="images/bang.svg" alt="" class="absolute -top-12 -right-15 transition" />
				<button
					type="submit"
					class="bg-dark-brown text-off-white hover:bg-dark-olive relative z-10 rounded-2xl px-16 py-6 text-2xl font-medium transition hover:scale-105 max-[600px]:px-8 max-[600px]:text-xl"
				>
					Получить бесплатную смету
				</button>
				<img
					src="images/bang.svg"
					alt=""
					class="absolute -top-12 -left-15 -scale-x-100 transition"
				/>
				<img src="images/hand.svg" alt="" class="absolute -top-82 -right-110" />
			</div>
		</form>
	</div>
</section>
