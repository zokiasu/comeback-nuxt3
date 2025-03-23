<template>
	<section id="input-create-style" class="w-full space-y-2">
		<input
			id="input"
			v-model="newStyle"
			type="text"
			placeholder="Add new style"
			class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out placeholder:text-zinc-500 focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
			@keyup.enter="
				async () => {
					await createStyle(newStyle, styleFetch)
					newStyle = ''
					emit('close-modal')
				}
			"
		/>
		<button
			class="w-full rounded bg-primary p-2 font-semibold hover:bg-red-900"
			@click="
				async () => {
					await createStyle(newStyle, styleFetch)
					newStyle = ''
					emit('close-modal')
				}
			"
		>
			Add a new style tag
		</button>
	</section>
</template>

<script lang="ts" setup>
	import { useFirebaseFunction } from '~/composables/useFirebaseFunction'
	const { createStyle } = useFirebaseFunction()

	defineProps({
		styleFetch: {
			type: Array,
			required: true,
		},
	})

	const emit = defineEmits(['close-modal'])

	const newStyle = ref('')
</script>
