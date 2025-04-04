<script setup lang="ts">
	import { Timestamp, doc, onSnapshot, updateDoc } from 'firebase/firestore'
	import { useToast } from 'vue-toastification'
	import { useFirebaseFunction } from '~/composables/useFirebaseFunction'
	import { useSupabaseMusicStyles } from '~/composables/Supabase/useSupabaseMusicStyles'
	import { useSupabaseGeneralTags } from '~/composables/Supabase/useSupabaseGeneralTags'

	const { $firestore: db } = useNuxtApp()
	const toast = useToast()
	const { createStyle, createTag } = useFirebaseFunction()
	const { createMusicStyle, getAllMusicStyles, deleteMusicStyle } = useSupabaseMusicStyles()
	const { createGeneralTag, getAllGeneralTags, deleteGeneralTag } = useSupabaseGeneralTags()

	const styleFetch = ref([] as any[])
	const newStyle = ref('')

	const generalTagFetch = ref([] as any[])
	const newGeneralTag = ref('')

	onMounted(async () => {
		styleFetch.value = await getAllMusicStyles()
		generalTagFetch.value = await getAllGeneralTags()

		styleFetch.value.sort((a, b) => {
			return a.name.localeCompare(b.name)
		})

		generalTagFetch.value.sort((a, b) => {
			return a.name.localeCompare(b.name)
		})
	})

	const creationStyle = async () => {
		if (styleFetch.value.find((style) => style.name === newStyle.value)) {
			toast.error('Style already exists')
			return
		}
		await createMusicStyle({ name: newStyle.value }).then(async () => {
			toast.success('Style created')
			styleFetch.value = await getAllMusicStyles()
			newStyle.value = ''
		})
	}

	const creationTag = async () => {
		if (generalTagFetch.value.find((tag) => tag.name === newGeneralTag.value)) {
			toast.error('Tag already exists')
			return
		}
		await createGeneralTag({ name: newGeneralTag.value }).then(async () => {
			toast.success('Tag created')
			generalTagFetch.value = await getAllGeneralTags()
			newGeneralTag.value = ''
		})
	}

	const deleteStyle = async (name: string) => {
		styleFetch.value = styleFetch.value.filter((style) => style.name !== name)
		await deleteMusicStyle(name).then(() => {
			toast.success('Style deleted')
		})
	}

	const deleteTag = async (name: string) => {
		generalTagFetch.value = generalTagFetch.value.filter((tag) => tag.name !== name)
		await deleteGeneralTag(name).then(() => {
			toast.success('Tag deleted')
		})
	}
</script>

<template>
	<div class="grid grid-cols-1 gap-5 overflow-y-auto lg:grid-cols-2">
		<section id="styles" class="space-y-3">
			<h2 class="text-lg font-semibold uppercase">Styles</h2>
			<section id="input-new-search" class="flex justify-start w-full gap-2">
				<input
					id="input"
					v-model="newStyle"
					type="text"
					placeholder="Add new style"
					class="w-full px-5 py-2 transition-all duration-300 ease-in-out border-none rounded bg-quinary placeholder-tertiary drop-shadow-xl placeholder:text-zinc-500 focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
					@keyup.enter="
						async () => {
							await creationStyle()
						}
					"
				/>
				<button
					class="w-full px-2 py-1 text-xs uppercase rounded bg-quinary hover:bg-zinc-500 sm:w-fit"
					@click="
						async () => {
							await creationStyle()
						}
					"
				>
					Send
				</button>
			</section>
			<div class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
				<div
					v-for="style in styleFetch"
					:key="style.name"
					class="flex items-center justify-between gap-2"
				>
					<div
						class="flex flex-col w-full rounded bg-quaternary px-2.5 py-1"
					>
						<p>{{ style.name }}</p>
						<p class="text-xs text-zinc-500">
							{{ style.created }}
						</p>
					</div>
					<div
						class="flex h-full cursor-pointer items-center justify-center rounded bg-quaternary px-2.5 hover:bg-primary"
						@click="deleteStyle(style.name)"
					>
						<IconDelete class="w-4 h-4" />
					</div>
				</div>
			</div>
		</section>
		
		<section id="general-tags" class="space-y-3">
			<h2 class="text-lg font-semibold uppercase">General Tags</h2>
			<section id="input-new-search" class="flex justify-start w-full gap-2">
				<input
					id="input"
					v-model="newGeneralTag"
					type="text"
					placeholder="Add new tag"
					class="w-full px-5 py-2 transition-all duration-300 ease-in-out border-none rounded bg-quinary placeholder-tertiary drop-shadow-xl placeholder:text-zinc-500 focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
					@keyup.enter="
						async () => {
							await creationTag()
						}
					"
				/>
				<button
					class="w-full px-2 py-1 text-xs uppercase rounded bg-quinary hover:bg-zinc-500 sm:w-fit"
					@click="
						async () => {
							await creationTag()
						}
					"
				>
					Send
				</button>
			</section>
			<div class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
				<div
					v-for="tag in generalTagFetch"
					:key="tag.name"
					class="flex items-center justify-between gap-2"
				>
					<div
						class="flex flex-col w-full rounded bg-quaternary px-2.5 py-1"
					>
						<p>{{ tag.name }}</p>
						<p class="text-xs text-zinc-500">
							{{ tag.created }}
						</p>
					</div>
					<div
						class="flex h-full cursor-pointer items-center justify-center rounded bg-quaternary px-2.5 hover:bg-primary"
						@click="deleteTag(tag.name)"
					>
						<IconDelete class="w-4 h-4" />
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
