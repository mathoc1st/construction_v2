<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { fn } from 'storybook/test';

	import EditBuildingForm from './EditBuildingForm.svelte';

	export const BuildingData = {
		id: '1',
		name: 'Test Building',
		type: 'FRAME',
		length: 10,
		width: 5,
		bathrooms: 2,
		bedrooms: 3,
		floors: 2,
		veranda: true,
		events: {
			onSaveBuilding: fn()
		}
	};

	const ListingData = {
		id: '1',
		name: 'Test Listing',
		price: 100000,
		area: 150,
		location: 'Test Location',
		buildingId: '1',
		events: {
			onSaveListing: fn()
		}
	};

	const { Story } = defineMeta({
		component: EditBuildingForm,
		title: 'EditBuildingForm',
		tags: ['autodocs'],
		excludeStories: /.*Data$/,
		args: {
			...BuildingData.events
		}
	});
</script>

<Story name="Default" args={{ building: BuildingData, listing: ListingData }} />
<Story name="Without Listing" args={{ building: BuildingData, listing: null }} />
<Story name="Without Building" args={{ building: null, listing: null }} />
<Story name="Without Building and Listing" args={{ building: null, listing: null }} />
