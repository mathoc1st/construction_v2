<script lang="ts">
	import Icon from '@iconify/svelte';
	import leaf from '$lib/assets/Leaf.svg';
	import logo from '$lib/assets/logo.jpg';
	import { tv } from 'tailwind-variants';
	import { Drawer, Drawerhead } from 'flowbite-svelte';

	let isDrawerOpen = $state(false);

	const navLink = tv({
		base: 'text-off-white flex h-full items-center px-4'
	});

	const navLi = tv({
		base: 'hover:bg-light-brown hover:*:text-dark-olive flex h-full items-center transition',
		variants: {
			device: {
				mobile: 'hover:*:text-light-brown hover:bg-transparent'
			}
		}
	});
</script>

<header class="bg-dark-olive relative top-0 h-16 w-screen">
	<div
		class="mx-auto flex h-full max-w-[1440px] justify-around overflow-hidden px-5 max-[1200px]:justify-between"
	>
		<a href="/" class="flex h-full items-center gap-2">
			<img src={logo} alt="" class="w-14" />
			<span class="text-off-white text-lg font-semibold">СК РУС ДОМ</span>
		</a>
		<nav class="h-full max-[1200px]:hidden">
			<ul class="flex h-full items-center gap-[clamp(0rem,1vw,2rem)]">
				<li class={navLi()}>
					<a href="/" class={navLink()}>Главная</a>
				</li>
				<li class={navLi()}>
					<a href="/catalog" class={navLink()}>Каталог</a>
				</li>
				<li class={navLi()}>
					<a href="/works" class={navLink()}>Наши работы</a>
				</li>
				<li class={navLi()}>
					<a href="/about" class={navLink()}>О нас</a>
				</li>
				<li class={navLi()}>
					<a href="/contacts" class={navLink()}>Контакты</a>
				</li>
			</ul>
		</nav>
		<div class="text-off-white flex h-full items-center gap-2 max-[1200px]:hidden">
			<Icon icon="el:phone-alt" class="size-5" />
			<a href="tel:+79266569425" class="hover:text-light-brown">+7 (926) 656-94-25</a>
		</div>

		<!-- Mobile -->
		<div class="flex h-full items-center min-[1200px]:hidden">
			<button class="group h-max" onclick={() => (isDrawerOpen = !isDrawerOpen)}
				><Icon
					icon="ci:hamburger-md"
					class="text-off-white group-hover:text-light-brown  size-12"
				/></button
			>
		</div>
	</div>
	<img src={leaf} alt="" class="absolute top-5 -z-10" />
</header>
<Drawer placement="top" bind:open={isDrawerOpen} class="backdrop:bg-off-white bg-dark-olive py-8">
	<nav class="h-full">
		<ul class="flex h-full flex-col items-center gap-6">
			<li class={navLi({ device: 'mobile' })}>
				<a href="/" class={navLink()}>Главная</a>
			</li>
			<li class={navLi({ device: 'mobile' })}>
				<a href="/catalog" class={navLink()}>Каталог</a>
			</li>
			<li class={navLi({ device: 'mobile' })}>
				<a href="/works" class={navLink()}>Наши работы</a>
			</li>
			<li class={navLi({ device: 'mobile' })}>
				<a href="/about" class={navLink()}>О нас</a>
			</li>
			<li class={navLi({ device: 'mobile' })}>
				<a href="/contacts" class={navLink()}>Контакты</a>
			</li>
		</ul>
	</nav>
	<div class="text-off-white mt-14 flex h-full items-center justify-center gap-2">
		<Icon icon="el:phone-alt" class="size-5" />
		<a href="tel:+79266569425" class="hover:text-light-brown">+7 (926) 656-94-25</a>
	</div>
</Drawer>
