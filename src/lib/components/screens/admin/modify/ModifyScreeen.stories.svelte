<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import ModifyScreen from './ModifyScreen.svelte';

	const { Story } = defineMeta({
		component: ModifyScreen,
		title: 'ModifyScreen',
		tags: ['autodocs'],
		excludeStories: /.*Data$/
	});
</script>

<Story name="Default" />
