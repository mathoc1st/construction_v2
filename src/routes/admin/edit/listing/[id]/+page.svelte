<script>
	import EditBuildingForm from '$lib/components/ui/admin/EditBuildingForm.svelte';

	let { data } = $props();
</script>

<section>
	<EditBuildingForm {data} />
</section>
