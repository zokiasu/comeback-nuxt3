<template>
	<section id="input-create-tag" class="w-full space-y-2">
		<input
			id="input"
			v-model="newGeneralTag"
			type="text"
			placeholder="Add new tag"
			class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out placeholder:text-zinc-500 focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
			@keyup.enter="
				async () => {
					await createTag(newGeneralTag)
				}
			"
		/>
		<button
			class="w-full rounded bg-primary p-2 font-semibold hover:bg-red-900"
			@click="
				async () => {
					await createTag(newGeneralTag)
				}
			"
		>
			Add a new tag
		</button>
	</section>
</template>

<script setup lang="ts">
	import type { GeneralTag } from '~/types/supabase/general_tag'
	import { useSupabaseGeneralTags } from '~/composables/Supabase/useSupabaseGeneralTags'
	import { useToast } from 'vue-toastification'

	const props = defineProps({
		generalTags: {
			type: Array as PropType<Omit<GeneralTag, 'id' | 'created_at' | 'updated_at'>[]>,
			required: true,
		},
	})

	const emit = defineEmits(['close-modal'])

	const { createGeneralTag } = useSupabaseGeneralTags()
	const toast = useToast()

	const newGeneralTag = ref<string>('')

	const createTag = async (newGeneralTag: string) => {
		if (newGeneralTag.trim() === '') {
			return
		}

		if (props.generalTags.find((tag) => tag.name === newGeneralTag)) {
			toast.error('Tag already exists')
			return
		}

		await createGeneralTag({ name: newGeneralTag })
		toast.success('Tag created successfully')
	}
</script>
