<template>
	<section id="input-create-style" class="w-full space-y-2">
		<input
			id="input"
			v-model="newStyle"
			type="text"
			placeholder="Add new style"
			class="bg-cb-quinary-900 placeholder-cb-tertiary-200 focus:bg-cb-tertiary-200 focus:text-cb-quinary-900 focus:placeholder-cb-quinary-900 w-full rounded border-none px-5 py-2 drop-shadow-xl transition-all duration-300 ease-in-out placeholder:text-zinc-500 focus:outline-none"
			@keyup.enter="
				async () => {
					await createStyle()
				}
			"
		/>
		<button
			class="bg-cb-primary-900 w-full rounded p-2 font-semibold hover:bg-red-900"
			@click="
				async () => {
					await createStyle()
				}
			"
		>
			Add a new style tag
		</button>
	</section>
</template>

<script setup lang="ts">
	import type { MusicStyle } from '~/types'
	import { useSupabaseMusicStyles } from '~/composables/Supabase/useSupabaseMusicStyles'

	const props = defineProps({
		styleFetch: {
			type: Array as PropType<Omit<MusicStyle, 'id' | 'created_at' | 'updated_at'>[]>,
			required: true,
		},
	})

	const emit = defineEmits(['close-modal'])

	const { createMusicStyle } = useSupabaseMusicStyles()
	const toast = useToast()

	const newStyle = ref<string>('')

	const createStyle = async () => {
		if (newStyle.value.trim() === '') {
			return
		}

		if (props.styleFetch.find((style) => style.name === newStyle.value)) {
			toast.add({
				title: 'This style already exists',
				color: 'error',
			})
			return
		}

		await createMusicStyle({ name: newStyle.value })
		newStyle.value = ''
		emit('close-modal')
	}
</script>
