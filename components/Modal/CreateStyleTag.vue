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
					await createStyle()
				}
			"
		/>
		<button
			class="w-full rounded bg-primary p-2 font-semibold hover:bg-red-900"
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
	import type { MusicStyle } from '~/types/supabase/music_style'
	import { useSupabaseMusicStyles } from '~/composables/Supabase/useSupabaseMusicStyles'
	import { useToast } from 'vue-toastification'

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
			toast.error('This style already exists')
			return
		}

		await createMusicStyle({ name: newStyle.value })
		newStyle.value = ''
		emit('close-modal')
	}
</script>
