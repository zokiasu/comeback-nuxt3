<script lang="ts" setup>
	import VueMultiselect from 'vue-multiselect'
	import { useToast } from 'vue-toastification'
	import { Timestamp } from 'firebase/firestore'
	import { useFirebaseArtist } from '@/composables/useFirebaseArtist'

	const toast = useToast()
	const { createArtist } = useFirebaseArtist()

	const { stylesList, tagsList, groupList, membersList } = defineProps({
		stylesList: {
			type: Array,
			required: true,
		},
		tagsList: {
			type: Array,
			required: true,
		},
		groupList: {
			type: Array,
			required: true,
		},
		membersList: {
			type: Array,
			required: true,
		},
	})

	const emit = defineEmits(['closeModal'])

	const artist = ref({
		id: '',
		idYoutubeMusic: '',
		name: '',
		type: 'SOLO',
		description: '',
		image: 'https://i.ibb.co/wLhbFZx/Frame-255.png',
		verified: false,
		activeCareer: false,
		platformList: [] as { name: string; link: string }[],
		socialList: [] as { name: string; link: string }[],
		styles: [],
		generalTags: [],
		groups: [],
		members: [],
		createdAt: null as Timestamp | null,
		updatedAt: null as Timestamp | null,
	})

	const isUploadingEdit = ref(false)

	const sendCreateArtist = async () => {
		isUploadingEdit.value = true

		if (artist.value.name === '') {
			toast.error('Please fill the required fields')
			isUploadingEdit.value = false
			return
		}

		const today = new Date()

		today.setDate(today.getDate())
		today.setHours(0, 0, 0, 0)

		const todayTimestamp = Timestamp.fromDate(today)

		artist.value.createdAt = todayTimestamp
		artist.value.updatedAt = todayTimestamp
		artist.value.verified = true

		createArtist(artist.value)
			.then((res) => {
				if (res != null) {
					toast.success('Artist created')
					isUploadingEdit.value = false
					emit('closeModal')
				} else {
					toast.error('Error: Artist not created')
					isUploadingEdit.value = false
				}
			})
			.catch((error) => {
				toast.error('Error: ' + error)
				isUploadingEdit.value = false
			})
	}

	const adjustTextarea = (event: Event) => {
		const textarea = event.target as HTMLTextAreaElement
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight}px`
	}
</script>

<template>
	<div class="space-y-5">
		<!-- Picture -->
		<div class="flex flex-col gap-2">
			<div class="flex items-end gap-2">
				<ComebackLabel label="Image" />
				<p class="text-sm italic text-quinary">
					Picture will be automaticaly update based on Youtube Music
				</p>
			</div>
		</div>
		<!-- Name & Id -->
		<div class="grid grid-cols-1 gap-5">
			<ComebackInput v-model="artist.name" label="Name *" placeholder="Artist Name*" />
			<ComebackInput
				v-model="artist.idYoutubeMusic"
				label="Id Youtube Music"
				placeholder="ID Youtube Music"
			/>
		</div>
		<!-- Type & Active Career-->
		<div class="grid grid-cols-1 gap-5">
			<!-- Type -->
			<div class="grid grid-cols-1 gap-1">
				<ComebackLabel label="Type" />
				<select
					v-model="artist.type"
					class="appearance-none border-b bg-transparent hover:cursor-pointer focus:outline-none"
				>
					<option value="SOLO" class="text-secondary">SOLO</option>
					<option value="GROUP" class="text-secondary">GROUP</option>
				</select>
			</div>
			<!-- Active Career -->
			<div class="grid grid-cols-1 gap-1">
				<ComebackLabel label="Active Career" />
				<select
					v-model="artist.activeCareer"
					class="appearance-none border-b bg-transparent hover:cursor-pointer focus:outline-none"
				>
					<option :value="true" class="text-secondary">Active</option>
					<option :value="false" class="text-secondary">Inactive</option>
				</select>
			</div>
		</div>
		<!-- Styles & General Tags -->
		<div class="grid grid-cols-1 gap-5">
			<!-- Styles -->
			<div v-if="stylesList" class="flex flex-col gap-1">
				<ComebackLabel label="Styles" />
				<VueMultiselect
					v-model="artist.styles"
					label="name"
					track-by="name"
					placeholder="Add a style"
					:options="stylesList"
					:multiple="true"
					:close-on-select="false"
					:clear-on-select="false"
					:preserve-search="false"
				/>
			</div>
			<!-- General Tags -->
			<div v-if="tagsList" class="flex flex-col gap-1">
				<ComebackLabel label="General Tags" />
				<VueMultiselect
					v-model="artist.generalTags"
					label="name"
					track-by="name"
					placeholder="Add a tag"
					:options="tagsList"
					:multiple="true"
					:close-on-select="false"
					:clear-on-select="false"
					:preserve-search="false"
				/>
			</div>
		</div>
		<!-- Description -->
		<div class="flex flex-col gap-1">
			<ComebackLabel label="Description" />
			<textarea
				v-model="artist.description"
				:placeholder="artist.description || 'Description'"
				class="min-h-full w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
				@input="adjustTextarea($event)"
			/>
		</div>
		<!-- Group -->
		<div v-if="groupList" class="flex flex-col gap-1">
			<ComebackLabel label="Group" />
			<VueMultiselect
				v-model="artist.groups"
				label="name"
				track-by="name"
				:options="groupList"
				placeholder="Search or add a group"
				:multiple="true"
				:close-on-select="false"
				:clear-on-select="false"
				:preserve-search="false"
			/>
		</div>
		<!-- Members -->
		<div v-if="membersList && artist.type != 'SOLO'" class="flex flex-col gap-1">
			<ComebackLabel label="Members" />
			<VueMultiselect
				v-model="artist.members"
				label="name"
				track-by="name"
				:options="membersList"
				placeholder="Search or add a member"
				:multiple="true"
				:close-on-select="false"
				:clear-on-select="false"
				:preserve-search="false"
			/>
		</div>
		<!-- Platforms & Socials -->
		<div class="space-y-2">
			<!-- Platforms -->
			<div class="w-full space-y-2">
				<ComebackLabel label="Platforms" />
				<div
					v-for="(platform, index) in artist.platformList"
					:key="platform"
					class="flex w-full gap-1"
				>
					<div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
						<input
							type="text"
							:value="platform.name"
							placeholder="Platform's Name"
							class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
							@input="artist.platformList[index].name = $event.target.value"
						/>
						<input
							type="text"
							:value="platform.link"
							placeholder="Platform's Link"
							class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
							@input="artist.platformList[index].link = $event.target.value"
						/>
					</div>
					<button
						class="rounded bg-primary p-1 text-xs hover:bg-red-900"
						@click="artist.platformList.splice(artist.platformList.indexOf(platform), 1)"
					>
						<IconDelete class="h-5 w-5" />
					</button>
				</div>
				<button
					class="w-full rounded bg-primary p-2 text-xs font-semibold uppercase hover:bg-red-900"
					@click="artist.platformList.push({ name: '', link: '' })"
				>
					Add Platforms
				</button>
			</div>
			<!-- Socials -->
			<div class="w-full space-y-2">
				<ComebackLabel label="Socials" />
				<div
					v-for="(social, index) in artist.socialList"
					:key="social"
					class="flex w-full gap-2"
				>
					<div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
						<input
							type="text"
							:value="social.name"
							placeholder="Social's Name"
							class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
							@input="artist.socialList[index].name = $event.target.value"
						/>
						<input
							type="text"
							:value="social.link"
							placeholder="Social's Link"
							class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
							@input="artist.socialList[index].link = $event.target.value"
						/>
					</div>
					<button
						class="rounded bg-primary p-1 text-xs hover:bg-red-900"
						@click="artist.socialList.splice(artist.socialList.indexOf(social), 1)"
					>
						<IconDelete class="h-5 w-5" />
					</button>
				</div>
				<button
					class="w-full rounded bg-primary p-2 text-xs font-semibold uppercase hover:bg-red-900"
					@click="artist.socialList.push({ name: '', link: '' })"
				>
					Add Socials
				</button>
			</div>
		</div>

		<div class="border-t border-zinc-700 pt-3">
			<button
				:disabled="isUploadingEdit"
				class="w-full rounded bg-primary py-3 text-xl font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
				@click="sendCreateArtist"
			>
				{{ isUploadingEdit ? 'Loading' : 'Saves' }}
			</button>
		</div>
	</div>
</template>
