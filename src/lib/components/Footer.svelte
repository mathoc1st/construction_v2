<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<footer class="bg-dark-olive h-max w-screen">
	<div
		class="relative mx-auto flex max-w-[1440px] items-center justify-between px-5 max-[600px]:flex-col max-[600px]:gap-8"
	>
		<img src="/images/grass2.svg" alt="" class="absolute -top-12 left-5" />
		<img src="/images/leaf7.svg" alt="" class="absolute -top-5 left-175 max-[760px]:hidden" />
		<img src="/images/grass.svg" alt="" class="absolute -top-15 right-20" />
		<a href="/" class="flex h-full items-center gap-2 max-[600px]:mt-10">
			<img src="/images/logo.jpg" alt="" class="w-14" />
			<span class="text-off-white text-lg font-semibold">СК РУС ДОМ</span>
		</a>
		<div>
			<ul class="text-off-white mt-8 text-center">
				<li>
					<a href="/" class="hover:text-light-brown transition">Главная</a>
				</li>
				<li>
					<a href="/" class="hover:text-light-brown transition">Каталог</a>
				</li>
				<li>
					<a href="/" class="hover:text-light-brown transition">Наши работы</a>
				</li>
				<li>
					<a href="/" class="hover:text-light-brown transition">О нас</a>
				</li>
				<li>
					<a href="/" class="hover:text-light-brown transition">Контакты</a>
				</li>
			</ul>
			<p class="text-off-white mt-6 mb-4 text-center text-sm max-[600px]:hidden">
				© 2025 ООО «СК РУС ДОМ». Все права защищены.
			</p>
		</div>
		<div class="flex flex-col gap-1">
			<a
				href="https://t.me/ckrusdom1"
				class="text-off-white hover:text-light-brown flex items-center gap-2 transition"
			>
				<Icon icon="ic:baseline-telegram" class="size-8" />+7 991 620 18 67
			</a>
			<p class="text-off-white flex items-center gap-2">
				<Icon icon="ic:baseline-whatsapp" class="size-8" />+7 991 620 18 67
			</p>
			<!-- <p class="text-off-white flex items-center gap-2">
				<Icon icon="material-symbols:mail-outline" class="size-8" />info@construction.ru
			</p> -->
		</div>
		<p class="text-off-white mt-4 mb-4 hidden text-center text-sm max-[600px]:block">
			© 2025 ООО «СК РУС ДОМ». Все права защищены.
		</p>
	</div>
</footer>
