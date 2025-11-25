<script lang="ts">
	import Action from '$lib/components/Action.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Showcase from '$lib/components/Showcase.svelte';
	import Support from '$lib/components/Support.svelte';
	import Testimonies from '$lib/components/Testimonies.svelte';
	import Work from '$lib/components/Work.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Hero />
<Showcase
	popularFrame={data.popularFrames.buildings}
	popularBarn={data.popularBarns.buildings}
	popularContainer={data.popularContainers.buildings}
/>
<Work />
<Testimonies />
<Action />
<Support />
