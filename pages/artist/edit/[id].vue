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
	import _ from 'lodash'

	definePageMeta({
		middleware: 'auth',
	})

	const { Modal } = Mdl
	const route = useRoute()
	const router = useRouter()
	const toast = useToast()
	const { isAdminStore } = useUserStore()

	const {
		getAllArtists,
		getFullArtistById,
		updateArtist,
		getSocialAndPlatformLinksByArtistId,
	} = useSupabaseArtist()
	const { getAllMusicStyles } = useSupabaseMusicStyles()
	const { getAllGeneralTags } = useSupabaseGeneralTags()

	const title = ref('Edit Artist Page')
	const description = ref('Edit Artist Page')

	const isUploadingEdit = ref<boolean>(false)
	const showModalCreateArtist = ref<boolean>(false)

	const artist = ref<Artist | null>(null)
	const groupList = ref<Artist[]>([])
	const membersList = ref<Artist[]>([])
	const artistsList = ref<Artist[]>([])
	const stylesList = ref<MusicStyle[]>([])
	const tagsList = ref<GeneralTag[]>([])

	const validGenders = ['MALE', 'FEMALE', 'MIXTE', 'UNKNOWN', 'OTHER'] as const
	const artistTypes = ['SOLO', 'GROUP'] as const

	const birthdayToDateFormat = ref<Date | null>(null)
	const debutDateToDateFormat = ref<Date | null>(null)

	const artistToEdit = ref<Partial<Artist>>()

	const artistPlatformList = ref<
		Omit<ArtistPlatformLink, 'id' | 'created_at' | 'artist_id'>[]
	>([])
	const artistSocialList = ref<
		Omit<ArtistSocialLink, 'id' | 'created_at' | 'artist_id'>[]
	>([])
	const artistGroups = ref<Artist[]>([])
	const artistMembers = ref<Artist[]>([])

	const showModalCreateStyle = ref(false)
	const showModalCreateTag = ref(false)

	const sendUpdateArtist = async () => {
		isUploadingEdit.value = true

		try {
			const updates: Partial<Artist> = {
				name: artistToEdit.value?.name,
				image: artistToEdit.value?.image,
				description: artistToEdit.value?.description,
				id_youtube_music: artistToEdit.value?.id_youtube_music,
				type: artistToEdit.value?.type,
				gender: artistToEdit.value?.gender,
				active_career: artistToEdit.value?.active_career,
				birth_date: artistToEdit.value?.birth_date,
				debut_date: artistToEdit.value?.debut_date,
				styles: artistToEdit.value?.styles,
				general_tags: artistToEdit.value?.general_tags,
			}

			await updateArtist(
				artist.value?.id_youtube_music || '',
				updates,
				artistSocialList.value,
				artistPlatformList.value,
				artistGroups.value,
				artistMembers.value,
			).then(() => {
				toast.success('Artiste mis à jour avec succès')
				isUploadingEdit.value = false
				router.push(`/artist/${route.params.id}`)
			})
		} catch (error) {
			console.error("Erreur lors de la mise à jour de l'artiste:", error)
			toast.error("Erreur lors de la mise à jour de l'artiste")
		} finally {
			isUploadingEdit.value = false
		}
	}

	const adjustTextarea = (textarea: HTMLTextAreaElement) => {
		textarea.style.height = 'auto'
		textarea.style.height = `${textarea.scrollHeight}px`
	}

	const closeModalCreateArtist = async () => {
		artistsList.value = await getAllArtists()
		groupList.value = artistsList.value.filter((artist) => artist.type === 'GROUP')
		membersList.value = artistsList.value
		showModalCreateArtist.value = false
	}

	const closeModalCreateStyle = async () => {
		showModalCreateStyle.value = false
		stylesList.value = await getAllMusicStyles()
	}

	const closeModalCreateTag = async () => {
		showModalCreateTag.value = false
		tagsList.value = await getAllGeneralTags()
	}

	onMounted(async () => {
		try {
			artist.value = await getFullArtistById(route.params.id as string)
			if (artist.value) {
				artistToEdit.value = { ...artist.value }

				const { socialLinks, platformLinks } = await getSocialAndPlatformLinksByArtistId(
					artist.value.id,
				)
				artistPlatformList.value = platformLinks || []
				artistSocialList.value = socialLinks || []
				artistGroups.value = artist.value.groups || []
				artistMembers.value = artist.value.members || []

				artistsList.value = await getAllArtists()
				groupList.value = artistsList.value.filter((artist) => artist.type === 'GROUP')
				membersList.value = artistsList.value

				stylesList.value = await getAllMusicStyles()
				tagsList.value = await getAllGeneralTags()

				const textarea = document.querySelector('textarea')
				if (textarea) {
					adjustTextarea(textarea)
				}

				title.value = 'EDIT ARTIST : ' + artist.value.name
				description.value = artist.value.description || ''
			}
		} catch (error) {
			console.error("Erreur lors du chargement de l'artiste:", error)
			toast.error("Erreur lors du chargement de l'artiste")
		}
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
	<div
		v-if="artist && artistToEdit"
		class="container mx-auto min-h-[calc(100vh-60px)] space-y-5 p-5 lg:px-10"
	>
		<div
			class="flex items-end justify-between pb-1 text-lg font-semibold uppercase border-b border-zinc-700 lg:text-xl"
		>
			<p>Artist Edition : {{ artistToEdit.name }}</p>
			<button
				:disabled="isUploadingEdit"
				class="px-3 py-1 text-base font-semibold uppercase transition-all duration-300 ease-in-out rounded w-fit bg-primary hover:scale-105 hover:bg-red-900"
				@click="sendUpdateArtist"
			>
				{{ isUploadingEdit ? 'Loading' : 'Saves' }}
			</button>
		</div>

		<div class="grid grid-cols-1 gap-5 2xl:grid-cols-2">
			<!-- Picture -->
			<div class="flex flex-col gap-2">
				<div class="flex items-end gap-2">
					<ComebackLabel label="Image" />
					<p class="text-sm italic text-quinary">
						Picture will be automaticaly update based on Youtube Music
					</p>
				</div>
				<NuxtImg
					v-if="artistToEdit.image"
					:src="artistToEdit.image"
					:alt="artistToEdit.name"
					format="webp"
					loading="lazy"
					class="object-cover w-full rounded"
				/>
			</div>
			<!-- Name & Id YTM & Birthday & Debut Date -->
			<div class="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-1">
				<ComebackInput
					v-model="artistToEdit.id"
					label="Unique Id"
					:placeholder="artist.id"
					disabled
				/>
				<ComebackInput
					v-model="artistToEdit.name"
					label="Name"
					:placeholder="artist.name"
				/>
				<ComebackInput
					v-model="artistToEdit.id_youtube_music"
					label="Id Youtube Music"
					:placeholder="artist.id_youtube_music"
				/>
				<!-- Birthday & Debut Date -->
				<div
					class="grid grid-cols-1 gap-5"
					:class="{ 'md:grid-cols-2': artistToEdit.type === 'SOLO' }"
				>
					<div class="space-y-1" :class="{ hidden: artistToEdit.type === 'GROUP' }">
						<ComebackLabel label="Birthday" />
						<VueDatePicker
							v-model="birthdayToDateFormat"
							placeholder="Select Date"
							auto-apply
							:enable-time-picker="false"
							dark
						/>
					</div>
					<div class="space-y-1">
						<ComebackLabel label="Debut Date" />
						<VueDatePicker
							v-model="debutDateToDateFormat"
							placeholder="Select Date"
							auto-apply
							:enable-time-picker="false"
							dark
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="space-y-5 lg:space-y-10">
			<!-- Gender & Type & Active Career -->
			<div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
				<!-- Gender -->
				<div class="grid w-full grid-cols-1 gap-1">
					<ComebackLabel label="Gender" />
					<div class="flex gap-2">
						<div
							v-for="gender in validGenders"
							:key="gender"
							class="flex items-center w-full gap-2"
						>
							<input
								:id="gender"
								v-model="artistToEdit.gender"
								type="radio"
								:value="gender"
								class="hidden"
							/>
							<button
								class="w-full px-3 py-1 text-sm rounded"
								:class="
									artistToEdit.gender === gender
										? 'bg-primary text-white'
										: 'bg-quaternary'
								"
								@click="artistToEdit.gender = gender"
							>
								{{ gender }}
							</button>
						</div>
					</div>
				</div>
				<!-- Type -->
				<div class="grid w-full grid-cols-1 gap-1">
					<ComebackLabel label="Type" />
					<div class="flex gap-2">
						<div
							v-for="type in artistTypes"
							:key="type"
							class="flex items-center w-full gap-2"
						>
							<input
								:id="type"
								v-model="artistToEdit.type"
								type="radio"
								:value="type"
								class="hidden"
							/>
							<button
								class="w-full px-3 py-1 text-sm rounded"
								:class="
									artistToEdit.type === type ? 'bg-primary text-white' : 'bg-quaternary'
								"
								@click="artistToEdit.type = type"
							>
								{{ type }}
							</button>
						</div>
					</div>
				</div>
				<!-- Active Career -->
				<div class="grid w-full grid-cols-1 gap-1">
					<ComebackLabel label="Active Career" />
					<div class="flex gap-2">
						<div
							v-for="status in [
								{ value: true, label: 'Active' },
								{ value: false, label: 'Inactive' },
							]"
							:key="status.label"
							class="flex items-center w-full gap-2"
						>
							<input
								:id="status.label"
								v-model="artistToEdit.active_career"
								type="radio"
								:value="status.value"
								class="hidden"
							/>
							<button
								class="w-full px-3 py-1 text-sm rounded"
								:class="
									artistToEdit.active_career === status.value
										? 'bg-primary text-white'
										: 'bg-quaternary'
								"
								@click="artistToEdit.active_career = status.value"
							>
								{{ status.label }}
							</button>
						</div>
					</div>
				</div>
			</div>
			<!-- Styles & General Tags -->
			<div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
				<!-- Styles -->
				<div v-if="stylesList" class="flex flex-col gap-1">
					<div class="flex justify-between gap-3">
						<ComebackLabel label="Styles" />
						<button
							class="px-2 py-1 text-xs font-semibold uppercase rounded w-fit bg-primary hover:bg-red-900"
							@click="showModalCreateStyle = true"
						>
							Create New Style
						</button>
					</div>
					<VueMultiselect
						v-model="artistToEdit.styles"
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
							class="px-2 py-1 text-xs font-semibold uppercase rounded w-fit bg-primary hover:bg-red-900"
							@click="showModalCreateTag = true"
						>
							Create New Tag
						</button>
					</div>
					<VueMultiselect
						v-model="artistToEdit.general_tags"
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
					v-model="artistToEdit.description"
					:placeholder="artistToEdit.description || 'Description'"
					class="min-h-full w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
					@input="adjustTextarea"
				/>
			</div>
			<!-- Group -->
			<div v-if="groupList" class="flex flex-col gap-1">
				<div class="flex justify-between gap-3">
					<ComebackLabel label="Group" />
					<button
						v-if="isAdminStore"
						class="px-2 py-1 text-xs font-semibold uppercase rounded w-fit bg-primary hover:bg-red-900"
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
			<div v-if="membersList && artistToEdit.type !== 'SOLO'" class="flex flex-col gap-1">
				<div class="flex justify-between gap-3">
					<ComebackLabel label="Members" />
					<button
						v-if="isAdminStore"
						class="px-2 py-1 text-xs font-semibold uppercase rounded w-fit bg-primary hover:bg-red-900"
						@click="showModalCreateArtist = true"
					>
						Create New Artist
					</button>
				</div>
				<VueMultiselect
					v-model="artistMembers"
					label="name"
					track-by="name"
					:options="membersList"
					placeholder="Search a member"
					:multiple="true"
					:close-on-select="false"
					:clear-on-select="false"
					:preserve-search="false"
				/>
			</div>
			<!-- Platforms & Socials -->
			<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
				<!-- Platforms -->
				<div class="w-full space-y-2">
					<ComebackLabel label="Platforms" />
					<div
						v-for="(platform, index) in artistPlatformList"
						:key="index + '_platform'"
						class="flex w-full gap-1"
					>
						<div class="w-full p-2 space-y-3 text-xs rounded bg-quinary">
							<input
								type="text"
								:value="platform.name"
								placeholder="Platform's Name"
								class="w-full transition-all duration-150 ease-in-out bg-transparent border-b outline-none appearance-none"
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
								class="w-full transition-all duration-150 ease-in-out bg-transparent border-b outline-none appearance-none"
								@input="
									(e: Event) =>
										(artistPlatformList[index].link = (
											e.target as HTMLInputElement
										).value)
								"
							/>
						</div>
						<button
							class="p-5 text-xs rounded bg-primary hover:bg-red-900"
							@click="artistPlatformList.splice(index, 1)"
						>
							Delete
						</button>
					</div>
					<button
						class="w-full p-2 text-xs font-semibold uppercase rounded bg-primary hover:bg-red-900"
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
						<div class="w-full p-2 space-y-3 text-xs rounded bg-quinary">
							<input
								type="text"
								:value="social.name"
								placeholder="Social's Name"
								class="w-full transition-all duration-150 ease-in-out bg-transparent border-b outline-none appearance-none"
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
								class="w-full transition-all duration-150 ease-in-out bg-transparent border-b outline-none appearance-none"
								@input="
									(e: Event) =>
										(artistSocialList[index].link =
											(e.target as HTMLInputElement).value || '')
								"
							/>
						</div>
						<button
							class="p-5 text-xs rounded bg-primary hover:bg-red-900"
							@click="artistSocialList.splice(index, 1)"
						>
							Delete
						</button>
					</div>
					<button
						class="w-full p-2 text-xs font-semibold uppercase rounded bg-primary hover:bg-red-900"
						@click="artistSocialList.push({ name: '', link: '' })"
					>
						Add Socials
					</button>
				</div>
			</div>
		</div>

		<div class="pt-3 border-t border-zinc-700">
			<button
				:disabled="isUploadingEdit"
				class="w-full py-3 text-xl font-semibold uppercase transition-all duration-300 ease-in-out rounded bg-primary hover:scale-105 hover:bg-red-900"
				@click="sendUpdateArtist"
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
				:members-list="membersList"
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
	<div v-else>
		<SkeletonDefault class="w-full rounded h-14" />
	</div>
</template>
