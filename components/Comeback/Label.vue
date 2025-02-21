<script setup>
	const { label, disabled } = defineProps({
		label: {
			type: String,
			required: false,
		},
		disabled: {
			type: Boolean,
			required: false,
		},
	})
</script>
<template>
	<div>
		<label
			class="text-sm font-semibold uppercase tracking-wide"
			:class="{ 'text-zinc-500': disabled }"
		>
			{{ label }}
		</label>
	</div>
</template>
