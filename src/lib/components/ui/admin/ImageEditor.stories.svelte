<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import ImageEditor from './ImageEditor.svelte';

	const { Story } = defineMeta({
		component: ImageEditor,
		title: 'ImageEditor',
		tags: ['autodocs'],
		excludeStories: /.*Data$/,
		args: {
			uploadedImages: [],
			onChangeImages: () => {}
		}
	});
</script>

<Story name="Default" />
