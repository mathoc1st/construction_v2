<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import EditBuildingForm from './EditBuildingForm.svelte';
	import type { FullListingDto } from '$lib/dtos/listing.dto';
	importAddListingDtonType } from '$lib/types/building.types';

	const mockForm: FullListingDto = {
		buildinAddListingDto
			length: 0,
			width: 0,
			height: 0,
			bathrooms: 0,
			bedrooms: 0,
			floors: 0,
			constructionType: ConstructionType.FRAME,
			veranda: false
		},
		listing: {
			title: '',
			images: []
		},
		finishes: [],
		images: []
	};

	const { Story } = defineMeta({
		component: EditBuildingForm,
		title: 'EditBuildingForm',
		tags: ['autodocs'],
		excludeStories: /.*Data$/
	});
</script>

<Story name="Default" args={{ data: { form: mockForm } }} />
<!-- <Story
	name="Without Listing"
	args={{ data: { ...mockForm, data: { ...mockForm.data, listing: null } } }}
/>
<Story
	name="Without Building"
	args={{ data: { ...mockForm, data: { ...mockForm.data, building: null } } }}
/>
<Story
	name="Without Building and Listing"
	args={{ data: { ...mockForm, data: { ...mockForm.data, building: null, listing: null } } }}
/> -->
