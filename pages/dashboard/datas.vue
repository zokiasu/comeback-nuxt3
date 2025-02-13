<script setup lang="ts">
	import { Timestamp, doc, onSnapshot, updateDoc } from 'firebase/firestore'
	import { useToast } from 'vue-toastification'

	const { $firestore: db } = useNuxtApp()
	const toast = useToast()
	const { createStyle, createTag } = useFirebaseFunction()

	const styleFetch = ref([] as any[])
	const newStyle = ref('')

	const generalTagFetch = ref([] as any[])
	const newGeneralTag = ref('')

	onMounted(async () => {
		onSnapshot(doc(db as any, 'general', 'data'), (doc) => {
			if (!doc.exists()) return

			styleFetch.value = doc?.data().styles
			generalTagFetch.value = doc?.data().generalTags

			styleFetch.value.sort((a, b) => {
				return a.name.localeCompare(b.name)
			})

			generalTagFetch.value.sort((a, b) => {
				return a.name.localeCompare(b.name)
			})
		})
	})

	const deleteStyle = async (name: string) => {
		styleFetch.value = styleFetch.value.filter((style) => style.name !== name)
		await updateDoc(doc(db as any, 'general', 'data'), {
			styles: styleFetch.value,
		}).then(() => {
			toast.success('Style deleted')
		})
	}

	const deleteTag = async (name: string) => {
		generalTagFetch.value = generalTagFetch.value.filter((tag) => tag.name !== name)
		await updateDoc(doc(db as any, 'general', 'data'), {
			generalTags: generalTagFetch.value,
		}).then(() => {
			toast.success('Tag deleted')
		})
	}
</script>

<template>
	<div class="grid grid-cols-1 gap-5 overflow-y-auto lg:grid-cols-2">
		<section id="styles" class="space-y-3">
			<h2 class="text-lg font-semibold uppercase">Styles</h2>
			<section id="input-new-search" class="flex w-full justify-start gap-2">
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
						}
					"
				/>
				<button
					class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
					@click="
						async () => {
							await createStyle(newStyle, styleFetch)
							newStyle = ''
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
						class="flex w-full items-center justify-between rounded bg-quaternary px-2.5 py-1"
					>
						<p>{{ style.name }}</p>
						<p class="text-xs text-zinc-500">
							{{ style.created.toDate().toLocaleDateString() }}
						</p>
					</div>
					<div
						class="flex h-full cursor-pointer items-center justify-center rounded bg-quaternary px-2.5 hover:bg-primary"
						@click="deleteStyle(style.name)"
					>
						<IconDelete class="h-4 w-4" />
					</div>
				</div>
			</div>
		</section>
		<section id="general-tags" class="space-y-3">
			<h2 class="text-lg font-semibold uppercase">General Tags</h2>
			<section id="input-new-search" class="flex w-full justify-start gap-2">
				<input
					id="input"
					v-model="newGeneralTag"
					type="text"
					placeholder="Add new tag"
					class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out placeholder:text-zinc-500 focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
					@keyup.enter="
						async () => {
							await createTag(newGeneralTag, generalTagFetch)
							newGeneralTag = ''
						}
					"
				/>
				<button
					class="w-full rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500 sm:w-fit"
					@click="
						async () => {
							await createTag(newGeneralTag, generalTagFetch)
							newGeneralTag = ''
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
						class="flex w-full items-center justify-between rounded bg-quaternary px-2.5 py-1"
					>
						<p>{{ tag.name }}</p>
						<p class="text-xs text-zinc-500">
							{{ tag.created.toDate().toLocaleDateString() }}
						</p>
					</div>
					<div
						class="flex h-full cursor-pointer items-center justify-center rounded bg-quaternary px-2.5 hover:bg-primary"
						@click="deleteTag(tag.name)"
					>
						<IconDelete class="h-4 w-4" />
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
