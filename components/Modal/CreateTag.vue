<template>
	<section id="input-create-tag" class="w-full space-y-2">
		<input
			id="input"
			v-model="newGeneralTag"
			type="text"
			placeholder="Add new tag"
			class="bg-quinary-900 placeholder-tertiary-200 focus:bg-tertiary-200 focus:text-quinary-900 focus:placeholder-quinary-900 w-full rounded border-none px-5 py-2 drop-shadow-xl transition-all duration-300 ease-in-out placeholder:text-zinc-500 focus:outline-none"
			@keyup.enter="
				async () => {
					await createTag(newGeneralTag)
				}
			"
		/>
		<button
			class="bg-primary-900 w-full rounded p-2 font-semibold hover:bg-red-900"
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
	import { useToast } from 'vue-toastification'
	import type { GeneralTag } from '~/types/supabase/general_tag'
	import { useSupabaseGeneralTags } from '~/composables/Supabase/useSupabaseGeneralTags'

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
