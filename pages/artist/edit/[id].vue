<script setup lang="ts">
	// External Packages
	// Réimporter CalendarDate et getLocalTimeZone
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
	import * as Mdl from '@kouts/vue-modal'
	import _ from 'lodash'

	// Internal Types
	import type { Artist } from '~/types/supabase/artist'
	import type { MusicStyle } from '~/types/supabase/music_style'
	import type { GeneralTag } from '~/types/supabase/general_tag'
	import type {
		ArtistGender,
		ArtistType,
		ArtistPlatformLink,
		ArtistSocialLink,
	} from '~/types/supabase'

	// Internal Composables
	import { useSupabaseArtist } from '~/composables/Supabase/useSupabaseArtist'
	import { useSupabaseMusicStyles } from '~/composables/Supabase/useSupabaseMusicStyles'
	import { useSupabaseGeneralTags } from '~/composables/Supabase/useSupabaseGeneralTags'

	// CSS / Side Effects
	// --- Type Helper for Menu Items ---
	// Crée un type générique qui ajoute 'label' à un type existant T
	type MenuItem<T> = T & { label: string }

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
	const showModalCreateStyle = ref<boolean>(false)
	const showModalCreateTag = ref<boolean>(false)

	const artist = ref<Artist | null>(null)
	const groupList = ref<Artist[]>([]) // Garde les groupes potentiels
	const membersList = ref<Artist[]>([]) // Garde les membres potentiels (tous les artistes)
	const artistsList = ref<Artist[]>([]) // Liste complète des artistes
	const stylesList = ref<MusicStyle[]>([])
	const tagsList = ref<GeneralTag[]>([])
	// Refs pour les v-model des UInputMenu - contiennent les objets sélectionnés
	const artistStyles = ref<MenuItem<MusicStyle>[]>([])
	const artistTags = ref<MenuItem<GeneralTag>[]>([])
	const artistGroups = ref<MenuItem<Omit<Artist, 'type'>>[]>([])
	const artistMembers = ref<MenuItem<Omit<Artist, 'type'>>[]>([])

	const validGenders = ['MALE', 'FEMALE', 'MIXTE', 'UNKNOWN', 'OTHER'] as const
	const artistTypes = ['SOLO', 'GROUP'] as const

	const birthdayToDate = ref<CalendarDate | null>(null)
	const debutDateToDate = ref<CalendarDate | null>(null)

	const artistToEdit = ref<Partial<Artist>>()

	const artistPlatformList = ref<
		Omit<ArtistPlatformLink, 'id' | 'created_at' | 'artist_id'>[]
	>([])
	const artistSocialList = ref<
		Omit<ArtistSocialLink, 'id' | 'created_at' | 'artist_id'>[]
	>([])

	// --- Date Formatter ---
	const df = new DateFormatter('en-US', {
		dateStyle: 'medium',
	})

	// --- Computed Properties for UInputMenu Items ---
	const stylesForMenu = computed((): MenuItem<MusicStyle>[] => {
		return stylesList.value.map(
			(style): MenuItem<MusicStyle> => ({
				...style,
				label: style.name,
			}),
		)
	})

	const tagsForMenu = computed((): MenuItem<GeneralTag>[] => {
		return tagsList.value.map(
			(tag): MenuItem<GeneralTag> => ({
				...tag,
				label: tag.name,
			}),
		)
	})

	const groupsForMenu = computed(() => {
		return groupList.value.map((artist): MenuItem<Omit<Artist, 'type'>> => {
			const { type, ...rest } = artist
			return {
				...rest,
				label: artist.name,
			}
		})
	})

	const membersForMenu = computed(() => {
		return artistsList.value.map((artist): MenuItem<Omit<Artist, 'type'>> => {
			const { type, ...rest } = artist
			return {
				...rest,
				label: artist.name,
			}
		})
	})

	// --- Helper to parse date string ---
	const parseToCalendarDate = (
		dateString: string | null | undefined,
	): CalendarDate | null => {
		if (!dateString) return null
		try {
			const date = new Date(dateString)
			if (isNaN(date.getTime())) return null // Invalid date
			const year = date.getUTCFullYear()
			const month = date.getUTCMonth() + 1 // CalendarDate expects 1-based month
			const day = date.getUTCDate()
			return new CalendarDate(year, month, day)
		} catch (e) {
			console.error('Failed to parse date string:', dateString, e)
			return null
		}
	}

	const sendUpdateArtist = async () => {
		isUploadingEdit.value = true

		try {
			// Validation simple
			if (!artistToEdit.value?.name) {
				toast.add({ title: 'Name is required', color: 'error' })
				isUploadingEdit.value = false
				return
			}

			const updates: Partial<Artist> = {
				name: artistToEdit.value?.name,
				// image: artistToEdit.value?.image, // L'image n'est pas modifiable ici
				description: artistToEdit.value?.description,
				id_youtube_music: artistToEdit.value?.id_youtube_music,
				type: artistToEdit.value?.type,
				gender: artistToEdit.value?.gender,
				active_career: artistToEdit.value?.active_career,
				// Convertir CalendarDate en ISO string pour la BDD
				birth_date: birthdayToDate.value
					? birthdayToDate.value.toDate(getLocalTimeZone()).toISOString()
					: null,
				debut_date: debutDateToDate.value
					? debutDateToDate.value.toDate(getLocalTimeZone()).toISOString()
					: null,
				// Mapper les objets sélectionnés pour obtenir les noms (ou IDs si backend changé)
				styles: artistStyles.value.map((style) => style.name),
				general_tags: artistTags.value.map((tag) => tag.name),
			}

			await updateArtist(
				artist.value?.id || '',
				updates,
				artistSocialList.value,
				artistPlatformList.value,
				artistGroups.value.map(({ label, ...rest }) => ({
					...rest,
					type: 'GROUP' as ArtistType,
				})),
				artistMembers.value.map(({ label, ...rest }) => ({
					...rest,
					type: 'SOLO' as ArtistType,
				})),
			)
				.then(() => {
					toast.add({ title: 'Artiste mis à jour avec succès', color: 'success' })
					isUploadingEdit.value = false
					// Optionnel: recharger les données ou naviguer
					router.push(`/artist/${route.params.id}`)
				})
				.catch((error) => {
					console.error("Erreur lors de la mise à jour de l'artiste:", error)
					toast.add({
						title: "Erreur lors de la mise à jour de l'artiste",
						description: error.message,
						color: 'error',
					})
				})
		} catch (error: any) {
			console.error("Erreur lors de la mise à jour de l'artiste:", error)
			toast.add({
				title: "Erreur lors de la mise à jour de l'artiste",
				description: error.message,
				color: 'error',
			})
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
			stylesList.value = await getAllMusicStyles()
			tagsList.value = await getAllGeneralTags()

			if (artist.value) {
				artistToEdit.value = { ...artist.value }

				const { socialLinks, platformLinks } = await getSocialAndPlatformLinksByArtistId(
					artist.value.id,
				)

				artistPlatformList.value = platformLinks || []
				artistSocialList.value = socialLinks || []
				artistGroups.value =
					artist.value.groups?.map((group) => ({
						...group,
						label: group.name,
						type: 'GROUP' as ArtistType,
					})) || []
				artistMembers.value =
					artist.value.members?.map((member) => ({
						...member,
						label: member.name,
						type: 'SOLO' as ArtistType,
					})) || []

				artistsList.value = await getAllArtists()
				groupList.value = artistsList.value.filter((artist) => artist.type === 'GROUP')
				membersList.value = artistsList.value

				artistStyles.value =
					artist.value.styles
						?.map((styleName) => {
							const style = stylesList.value.find((s) => s.name === styleName)
							return style
								? ({ ...style, label: style.name } as MenuItem<MusicStyle>)
								: null
						})
						.filter((item): item is MenuItem<MusicStyle> => item !== null) || []
				artistTags.value =
					artist.value.general_tags
						?.map((tagName) => {
							const tag = tagsList.value.find((t) => t.name === tagName)
							return tag ? ({ ...tag, label: tag.name } as MenuItem<GeneralTag>) : null
						})
						.filter((item): item is MenuItem<GeneralTag> => item !== null) || []

				// Initialiser les CalendarDate à partir des dates de l'artiste
				birthdayToDate.value = parseToCalendarDate(artist.value.birth_date)
				debutDateToDate.value = parseToCalendarDate(artist.value.debut_date)

				const textarea = document.querySelector('textarea')
				if (textarea) {
					adjustTextarea(textarea)
				}

				title.value = 'EDIT ARTIST : ' + artist.value.name
				description.value = artist.value.description || ''
			}
		} catch (error: any) {
			console.error("Erreur lors du chargement de l'artiste:", error)
			toast.add({
				title: "Erreur lors du chargement de l'artiste",
				description: error.message,
				color: 'error',
			})
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
		v-if="artistToEdit && artist"
		class="container mx-auto min-h-[calc(100vh-60px)] space-y-5 p-5 lg:px-10"
	>
		<div
			class="flex items-end justify-between border-b border-zinc-700 pb-1 text-lg font-semibold uppercase lg:text-xl"
		>
			<p>Artist Edition : {{ artistToEdit.name }}</p>
			<button
				:disabled="isUploadingEdit"
				class="bg-cb-primary-900 w-fit rounded px-3 py-1 text-base font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
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
					<p class="text-cb-quinary-900 text-sm italic">
						Picture will be automaticaly update based on Youtube Music
					</p>
				</div>
				<NuxtImg
					v-if="artistToEdit.image"
					:src="artistToEdit.image"
					:alt="artistToEdit.name"
					format="webp"
					loading="lazy"
					class="w-full rounded object-cover"
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
					class="grid gap-5"
					:class="artistToEdit.type == 'GROUP' ? 'grid-cols-1' : 'grid-cols-2'"
				>
					<!-- Birthday -->
					<div class="space-y-1" :class="{ hidden: artistToEdit.type === 'GROUP' }">
						<ComebackLabel label="Birthday" />
						<UPopover>
							<UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
								{{
									birthdayToDate
										? df.format(birthdayToDate.toDate(getLocalTimeZone()))
										: 'Select a date'
								}}
							</UButton>
							<template #content>
								<UCalendar
									class="bg-cb-quinary-900 rounded p-1"
									:model-value="birthdayToDate as CalendarDate | null"
									@update:model-value="
										(value) => {
											birthdayToDate = value as CalendarDate | null
										}
									"
									:min-date="new Date(1900, 0, 1)"
								/>
							</template>
						</UPopover>
					</div>
					<!-- Debut Date -->
					<div class="space-y-1">
						<ComebackLabel label="Debut Date" />
						<UPopover>
							<UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
								{{
									debutDateToDate
										? df.format(debutDateToDate.toDate(getLocalTimeZone()))
										: 'Select a date'
								}}
							</UButton>
							<template #content>
								<UCalendar
									class="bg-cb-quinary-900 rounded p-1"
									:model-value="debutDateToDate as CalendarDate | null"
									@update:model-value="
										(value) => {
											debutDateToDate = value as CalendarDate | null
										}
									"
									:min-date="new Date(2000, 0, 1)"
								/>
							</template>
						</UPopover>
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
							class="flex w-full items-center gap-2"
						>
							<input
								:id="gender"
								v-model="artistToEdit.gender"
								type="radio"
								:value="gender"
								class="hidden"
							/>
							<button
								class="w-full rounded px-3 py-1 text-sm"
								:class="
									artistToEdit.gender === gender
										? 'bg-cb-primary-900 text-white'
										: 'bg-cb-quaternary-950'
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
							class="flex w-full items-center gap-2"
						>
							<input
								:id="type"
								v-model="artistToEdit.type"
								type="radio"
								:value="type"
								class="hidden"
							/>
							<button
								class="w-full rounded px-3 py-1 text-sm"
								:class="
									artistToEdit.type === type
										? 'bg-cb-primary-900 text-white'
										: 'bg-cb-quaternary-950'
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
							class="flex w-full items-center gap-2"
						>
							<input
								:id="status.label"
								v-model="artistToEdit.active_career"
								type="radio"
								:value="status.value"
								class="hidden"
							/>
							<button
								class="w-full rounded px-3 py-1 text-sm"
								:class="
									artistToEdit.active_career === status.value
										? 'bg-cb-primary-900 text-white'
										: 'bg-cb-quaternary-950'
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
							class="bg-cb-primary-900 w-fit rounded px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
							@click="showModalCreateStyle = true"
						>
							Create New Style
						</button>
					</div>
					<UInputMenu
						v-model="artistStyles"
						:items="stylesForMenu"
						by="id"
						multiple
						placeholder="Select styles"
						searchable
						searchable-placeholder="Search a style..."
					/>
				</div>
				<!-- General Tags -->
				<div v-if="tagsList" class="flex flex-col gap-1">
					<div class="flex justify-between gap-3">
						<ComebackLabel label="General Tags" />
						<button
							class="bg-cb-primary-900 w-fit rounded px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
							@click="showModalCreateTag = true"
						>
							Create New Tag
						</button>
					</div>
					<UInputMenu
						v-model="artistTags"
						:items="tagsForMenu"
						by="id"
						multiple
						placeholder="Select tags"
						searchable
						searchable-placeholder="Search a tag..."
					/>
				</div>
			</div>
			<!-- Description -->
			<div class="flex flex-col gap-1">
				<ComebackLabel label="Description" />
				<textarea
					v-model="artistToEdit.description"
					:placeholder="artistToEdit.description || 'Description'"
					class="focus:bg-cb-tertiary-200 focus:text-cb-secondary-950 min-h-full w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:p-1.5 focus:outline-none"
					@input="(e: Event) => adjustTextarea(e.target as HTMLTextAreaElement)"
				/>
			</div>
			<!-- Group -->
			<div v-if="groupList" class="flex flex-col gap-1">
				<div class="flex justify-between gap-3">
					<ComebackLabel label="Group" />
					<button
						v-if="isAdminStore"
						class="bg-cb-primary-900 w-fit rounded px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
						@click="showModalCreateArtist = true"
					>
						Create New Artist
					</button>
				</div>
				<UInputMenu
					v-model="artistGroups"
					:items="groupsForMenu"
					by="id"
					multiple
					placeholder="Search a group"
					searchable
					searchable-placeholder="Search a group..."
				/>
			</div>
			<!-- Members -->
			<div
				v-if="artistsList && artistToEdit.type === 'GROUP'"
				class="flex flex-col gap-1"
			>
				<div class="flex justify-between gap-3">
					<ComebackLabel label="Members" />
					<button
						v-if="isAdminStore"
						class="bg-cb-primary-900 w-fit rounded px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
						@click="showModalCreateArtist = true"
					>
						Create New Artist
					</button>
				</div>
				<UInputMenu
					v-model="artistMembers"
					:items="membersForMenu"
					by="id"
					multiple
					placeholder="Search a member"
					searchable
					searchable-placeholder="Search a member..."
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
						<div class="bg-cb-quinary-900 w-full space-y-3 rounded p-2 text-xs">
							<input
								type="text"
								:value="platform.name"
								placeholder="Platform's Name"
								class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out outline-none"
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
								class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out outline-none"
								@input="
									(e: Event) =>
										(artistPlatformList[index].link = (
											e.target as HTMLInputElement
										).value)
								"
							/>
						</div>
						<button
							class="bg-cb-primary-900 rounded p-5 text-xs hover:bg-red-900"
							@click="artistPlatformList.splice(index, 1)"
						>
							Delete
						</button>
					</div>
					<button
						class="bg-cb-primary-900 w-full rounded p-2 text-xs font-semibold uppercase hover:bg-red-900"
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
						<div class="bg-cb-quinary-900 w-full space-y-3 rounded p-2 text-xs">
							<input
								type="text"
								:value="social.name"
								placeholder="Social's Name"
								class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out outline-none"
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
								class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out outline-none"
								@input="
									(e: Event) =>
										(artistSocialList[index].link =
											(e.target as HTMLInputElement).value || '')
								"
							/>
						</div>
						<button
							class="bg-cb-primary-900 rounded p-5 text-xs hover:bg-red-900"
							@click="artistSocialList.splice(index, 1)"
						>
							Delete
						</button>
					</div>
					<button
						class="bg-cb-primary-900 w-full rounded p-2 text-xs font-semibold uppercase hover:bg-red-900"
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
				class="bg-cb-primary-900 w-full rounded py-3 text-xl font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
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
</template>
