<script setup lang="ts">
	import type { Artist } from '~/types/supabase/artist'
	import type { MusicStyle } from '~/types/supabase/music_style'
	import type { GeneralTag } from '~/types/supabase/general_tag'
	import type {
		ArtistGender,
		ArtistType,
		ArtistPlatformLink,
		ArtistSocialLink,
	} from '~/types/supabase'
	import { useSupabaseArtist } from '~/composables/Supabase/useSupabaseArtist'
	import { useSupabaseMusicStyles } from '~/composables/Supabase/useSupabaseMusicStyles'
	import { useSupabaseGeneralTags } from '~/composables/Supabase/useSupabaseGeneralTags'

	import VueMultiselect from 'vue-multiselect'
	import '@vuepic/vue-datepicker/dist/main.css'
	import VueDatePicker from '@vuepic/vue-datepicker'
	import { useToast } from 'vue-toastification'
	import * as Mdl from '@kouts/vue-modal'

	definePageMeta({
		middleware: 'auth',
	})

	const { Modal } = Mdl
	const toast = useToast()
	const { isAdminStore } = useUserStore()

	const { getAllArtists, createArtist } = useSupabaseArtist()
	const { getAllMusicStyles } = useSupabaseMusicStyles()
	const { getAllGeneralTags } = useSupabaseGeneralTags()

	const title = ref<string>('Create Artist Page')
	const description = ref<string>('Create Artist Page')

	const isUploadingEdit = ref<boolean>(false)
	const showModalCreateArtist = ref<boolean>(false)
	const showModalCreateStyle = ref<boolean>(false)
	const showModalCreateTag = ref<boolean>(false)

	const stylesList = ref<MusicStyle[]>([])
	const tagsList = ref<GeneralTag[]>([])
	const groupList = ref<Artist[]>([])
	const artistsList = ref<Artist[]>([])

	const artistImage = ref<string>('https://i.ibb.co/wLhbFZx/Frame-255.png')
	const artistName = ref<string>('')
	const artistIdYoutubeMusic = ref<string>('')
	const birthdayToDate = ref<Date | null>(null)
	const debutDateToDate = ref<Date | null>(null)

	const artistGroups = ref<Artist[]>([])
	const artistMembers = ref<Artist[]>([])
	const artistGender = ref<ArtistGender>('UNKNOWN')
	const artistType = ref<ArtistType>('SOLO')
	const artistActiveCareer = ref<boolean>(true)

	const artistStyles = ref<MusicStyle[]>([])
	const artistTags = ref<GeneralTag[]>([])
	const artistDescription = ref<string>('')
	const artistPlatformList = ref<
		Omit<ArtistPlatformLink, 'id' | 'created_at' | 'artist_id'>[]
	>([])
	const artistSocialList = ref<
		Omit<ArtistSocialLink, 'id' | 'created_at' | 'artist_id'>[]
	>([])

	const closeModalCreateStyle = async () => {
		showModalCreateStyle.value = false
		stylesList.value = await getAllMusicStyles()
	}

	const closeModalCreateTag = async () => {
		showModalCreateTag.value = false
		tagsList.value = await getAllGeneralTags()
	}

	const creationArtist = async () => {
		isUploadingEdit.value = true

		if (artistName.value === '') {
			toast.error('Please fill the required fields')
			isUploadingEdit.value = false
			return
		}

		const artistStyleListName = artistStyles.value.map((style) => style.name)
		const artistTagListName = artistTags.value.map((tag) => tag.name)

		const artist: Omit<Artist, 'id' | 'created_at' | 'updated_at'> = {
			name: artistName.value,
			image: artistImage.value,
			description: artistDescription.value,
			id_youtube_music: artistIdYoutubeMusic.value,
			type: artistType.value,
			gender: artistGender.value,
			active_career: artistActiveCareer.value,
			verified: isAdminStore,
			birth_date: birthdayToDate.value?.toISOString() || null,
			debut_date: debutDateToDate.value?.toISOString() || null,
			styles: artistStyleListName,
			general_tags: artistTagListName,
		}

		createArtist(
			artist,
			artistSocialList.value,
			artistPlatformList.value,
			artistGroups.value,
			artistMembers.value,
		).then((newArtist) => {
			isUploadingEdit.value = false
			toast.success('Artist created successfully')
		})
	}

	const closeModalCreateArtist = async () => {
		artistsList.value = await queryByCollection('artists')
		groupList.value = artistsList.value.filter((artist) => artist.type === 'GROUP')
		showModalCreateArtist.value = false
	}

	const adjustTextarea = (event: Event) => {
		const textarea = event.target as HTMLTextAreaElement
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight}px`
	}

	onMounted(async () => {
		artistsList.value = await getAllArtists()
		groupList.value = artistsList.value.filter((artist) => artist.type == 'GROUP')

		stylesList.value = await getAllMusicStyles()
		tagsList.value = await getAllGeneralTags()
	})

	useHead({
		title,
		meta: [
			{
				name: 'description',
				content: description,
			},
		],
	})
</script>

<template>
	<div class="container mx-auto min-h-[calc(100vh-60px)] space-y-5 p-5 lg:px-10">
		<div
			class="flex items-center justify-between border-b border-zinc-700 pb-1 text-lg font-semibold uppercase lg:text-xl"
		>
			<p>Artist Creation</p>
			<div>
				<button
					:disabled="isUploadingEdit"
					class="w-full rounded bg-primary px-5 py-3 text-xs font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
					@click="creationArtist"
				>
					{{ isUploadingEdit ? 'Loading' : 'Saves' }}
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
			<!-- Picture -->
			<div class="flex flex-col gap-2">
				<div class="flex items-end gap-2">
					<ComebackLabel label="Image" />
					<p class="text-sm italic text-quinary">
						Picture will be automaticaly update based on Youtube Music
					</p>
				</div>
				<NuxtImg
					v-if="artistImage"
					:src="artistImage"
					:alt="artistName"
					format="webp"
					loading="lazy"
					class="w-full rounded object-cover"
				/>
			</div>
			<!-- Name & Id YTM & Birthday & Debut Date -->
			<div class="space-y-4">
				<ComebackInput v-model="artistName" label="Name *" placeholder="Artist Name*" />
				<ComebackInput
					v-model="artistIdYoutubeMusic"
					label="Id Youtube Music *"
					placeholder="ID Youtube Music"
				/>
				<!-- Birthday -->
				<div class="space-y-1" :class="{ hidden: artistType == 'GROUP' }">
					<ComebackLabel label="Birthday" />
					<VueDatePicker
						v-model="birthdayToDate"
						placeholder="Select Date"
						auto-apply
						:enable-time-picker="false"
						dark
					/>
				</div>
				<!-- Debut Date -->
				<div class="space-y-1">
					<ComebackLabel label="Debut Date" />
					<VueDatePicker
						v-model="debutDateToDate"
						placeholder="Select Date"
						auto-apply
						:enable-time-picker="false"
						dark
					/>
				</div>
			</div>
		</div>

		<div class="space-y-5">
			<!-- Gender & Type & Active Career -->
			<div class="grid grid-cols-1 gap-5 md:grid-cols-3">
				<!-- Gender -->
				<div class="grid grid-cols-1 gap-1">
					<div class="flex items-end gap-2">
						<ComebackLabel label="Gender" />
						<p class="text-sm italic text-quinary">
							It's only for stat we don't assume any gender jugement
						</p>
					</div>
					<select
						v-model="artistGender"
						class="appearance-none border-b bg-transparent hover:cursor-pointer focus:outline-none"
					>
						<option default value="UNKNOWN" class="text-secondary">UNKNOWN</option>
						<option value="MALE" class="text-secondary">MALE</option>
						<option value="FEMALE" class="text-secondary">FEMALE</option>
						<option value="MIXTE" class="text-secondary">MIXTE</option>
					</select>
				</div>
				<!-- Type -->
				<div class="grid grid-cols-1 gap-1">
					<ComebackLabel label="Type" />
					<select
						v-model="artistType"
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
						v-model="artistActiveCareer"
						class="appearance-none border-b bg-transparent hover:cursor-pointer focus:outline-none"
					>
						<option :value="true" class="text-secondary">Active</option>
						<option :value="false" class="text-secondary">Inactive</option>
					</select>
				</div>
			</div>
			<!-- Styles & General Tags -->
			<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
				<!-- Styles -->
				<div v-if="stylesList" class="flex flex-col gap-1">
					<div class="flex justify-between gap-3">
						<ComebackLabel label="Styles" />
						<button
							class="w-fit rounded bg-primary px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
							@click="showModalCreateStyle = true"
						>
							Create New Style
						</button>
					</div>
					<VueMultiselect
						v-model="artistStyles"
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
					<div class="flex justify-between gap-3">
						<ComebackLabel label="General Tags" />
						<button
							class="w-fit rounded bg-primary px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
							@click="showModalCreateTag = true"
						>
							Create New Tag
						</button>
					</div>
					<VueMultiselect
						v-model="artistTags"
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
					v-model="artistDescription"
					placeholder="Description"
					class="min-h-full w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
					@input="adjustTextarea($event)"
				/>
			</div>
			<!-- Group -->
			<div v-if="groupList" class="flex flex-col gap-1">
				<div class="flex justify-between gap-3">
					<ComebackLabel label="Group" />
					<button
						v-if="isAdminStore"
						class="w-fit rounded bg-primary px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
						@click="showModalCreateArtist = true"
					>
						Create New Artist
					</button>
				</div>
				<VueMultiselect
					v-model="artistGroups"
					label="name"
					track-by="name"
					:options="groupList"
					placeholder="Search a group"
					:multiple="true"
					:close-on-select="false"
					:clear-on-select="false"
					:preserve-search="false"
				/>
			</div>
			<!-- Members -->
			<div v-if="artistsList && artistType != 'SOLO'" class="flex flex-col gap-1">
				<div class="flex justify-between gap-3">
					<ComebackLabel label="Members" />
					<button
						v-if="isAdminStore"
						class="w-fit rounded bg-primary px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
						@click="showModalCreateArtist = true"
					>
						Create New Artist
					</button>
				</div>
				<VueMultiselect
					v-model="artistMembers"
					label="name"
					track-by="name"
					:options="artistsList"
					placeholder="Search a member"
					:multiple="true"
					:close-on-select="false"
					:clear-on-select="false"
					:preserve-search="false"
				/>
			</div>
			<!-- Platforms & Socials -->
			<div class="flex gap-2">
				<!-- Platforms -->
				<div class="w-full space-y-2">
					<ComebackLabel label="Platforms" />
					<div
						v-for="(platform, index) in artistPlatformList"
						:key="index + '_platform'"
						class="flex w-full gap-1"
					>
						<div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
							<input
								type="text"
								:value="platform.name"
								placeholder="Platform's Name"
								class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
								@input="
									(e: Event) =>
										(artistPlatformList[index].name = (
											e.target as HTMLInputElement
										).value)
								"
							/>
							<input
								type="text"
								:value="platform.link"
								placeholder="Platform's Link"
								class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
								@input="
									(e: Event) =>
										(artistPlatformList[index].link = (
											e.target as HTMLInputElement
										).value)
								"
							/>
						</div>
						<button
							class="rounded bg-primary p-5 text-xs hover:bg-red-900"
							@click="artistPlatformList.splice(artistPlatformList.indexOf(platform), 1)"
						>
							Delete
						</button>
					</div>
					<button
						class="w-full rounded bg-primary p-2 text-xs font-semibold uppercase hover:bg-red-900"
						@click="artistPlatformList.push({ name: '', link: '' })"
					>
						Add Platforms
					</button>
				</div>
				<!-- Socials -->
				<div class="w-full space-y-2">
					<ComebackLabel label="Socials" />
					<div
						v-for="(social, index) in artistSocialList"
						:key="index + '_social'"
						class="flex w-full gap-2"
					>
						<div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
							<input
								type="text"
								:value="social.name"
								placeholder="Social's Name"
								class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
								@input="
									(e: Event) =>
										(artistSocialList[index].name =
											(e.target as HTMLInputElement).value || '')
								"
							/>
							<input
								type="text"
								:value="social.link"
								placeholder="Social's Link"
								class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
								@input="
									(e: Event) =>
										(artistSocialList[index].link =
											(e.target as HTMLInputElement).value || '')
								"
							/>
						</div>
						<button
							class="rounded bg-primary p-5 text-xs hover:bg-red-900"
							@click="artistSocialList.splice(artistSocialList.indexOf(social), 1)"
						>
							Delete
						</button>
					</div>
					<button
						class="w-full rounded bg-primary p-2 text-xs font-semibold uppercase hover:bg-red-900"
						@click="artistSocialList.push({ name: '', link: '' })"
					>
						Add Socials
					</button>
				</div>
			</div>
		</div>

		<div class="border-t border-zinc-700 pt-3">
			<button
				:disabled="isUploadingEdit"
				class="w-full rounded bg-primary py-3 text-xl font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
				@click="creationArtist"
			>
				{{ isUploadingEdit ? 'Loading' : 'Saves' }}
			</button>
		</div>

		<Modal
			v-model="showModalCreateArtist"
			title="Create Artist"
			wrapper-class="modal-wrapper"
			:modal-class="`modal-lg`"
			:modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
			:in-class="`animate__bounceIn`"
			:out-class="`animate__bounceOut`"
			bg-class="animate__animated"
			:bg-in-class="`animate__fadeInUp`"
			:bg-out-class="`animate__fadeOutDown`"
		>
			<ModalCreateArtist
				:styles-list="stylesList"
				:tags-list="tagsList"
				:group-list="groupList"
				:members-list="artistsList"
				@close-modal="closeModalCreateArtist"
			/>
		</Modal>

		<Modal
			v-model="showModalCreateStyle"
			title="Create Style"
			wrapper-class="modal-wrapper"
			:modal-class="`modal-lg`"
			:modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
			:in-class="`animate__bounceIn`"
			:out-class="`animate__bounceOut`"
			bg-class="animate__animated"
			:bg-in-class="`animate__fadeInUp`"
			:bg-out-class="`animate__fadeOutDown`"
		>
			<ModalCreateStyleTag
				:style-fetch="stylesList"
				@close-modal="closeModalCreateStyle"
			/>
		</Modal>

		<Modal
			v-model="showModalCreateTag"
			title="Create Tag"
			wrapper-class="modal-wrapper"
			:modal-class="`modal-lg`"
			:modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
			:in-class="`animate__bounceIn`"
			:out-class="`animate__bounceOut`"
			bg-class="animate__animated"
			:bg-in-class="`animate__fadeInUp`"
			:bg-out-class="`animate__fadeOutDown`"
		>
			<ModalCreateTag :general-tags="tagsList" @close-modal="closeModalCreateTag" />
		</Modal>
	</div>
</template>
