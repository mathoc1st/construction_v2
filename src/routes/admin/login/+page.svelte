<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<form
	method="post"
	action="?/login"
	use:enhance
	class="flex flex-col items-center justify-center gap-4 rounded-2xl px-4 py-6"
>
	<div
		style="background-color: rgba(178, 178, 178, 0.3);"
		class="relative flex max-w-max rounded-3xl"
	>
		<input
			class="peer text-primary-text w-64 px-2 py-2 max-[600px]:w-[60vw]"
			type="text"
			id="username"
			name="username"
			placeholder=" "
			required
		/>
		<label
			for="username"
			class="text-primary-text absolute top-1/2 bottom-0 left-0 -translate-y-1/2 pb-6 pl-2 opacity-0 peer-placeholder-shown:opacity-100 peer-focus:opacity-0"
			>Username</label
		>
	</div>
	<div
		style="background-color: rgba(178, 178, 178, 0.3);"
		class="relative flex max-w-max rounded-3xl"
	>
		<input
			class="peer text-primary-text w-64 px-2 py-2 max-[600px]:w-[60vw]"
			type="password"
			id="password"
			name="password"
			placeholder=" "
			required
		/>
		<label
			for="name"
			class="text-primary-text absolute top-1/2 bottom-0 left-0 -translate-y-1/2 pb-6 pl-2 opacity-0 peer-placeholder-shown:opacity-100 peer-focus:opacity-0"
			>Password</label
		>
	</div>
	<div class="mt-5 grid w-full grid-rows-2 place-items-center gap-2">
		<button
			class="bg-dark-brown hover:bg-dark-olive hover:text-primary-text w-36 rounded-3xl px-4 py-2 text-white transition"
			>Login</button
		>
		<button
			formaction="?/register"
			class="bg-light-brown hover:text-dark-olive hover:text-primary-text w-36 rounded-3xl px-4 py-2 text-white transition"
			>Register</button
		>
	</div>
	<p style="color: red">{form?.message ?? ''}</p>
</form>
