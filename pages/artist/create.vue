<script setup lang="ts">
	// Réimporter CalendarDate et getLocalTimeZone
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		ZonedDateTime,
	} from '@internationalized/date'

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

	// Crée un type générique qui ajoute 'label' à un type existant T
	type MenuItem<T> = T & { label: string }

	const toast = useToast()
	const { isAdminStore } = useUserStore()

	const { getAllArtists, createArtist } = useSupabaseArtist()
	const { getAllMusicStyles } = useSupabaseMusicStyles()
	const { getAllGeneralTags } = useSupabaseGeneralTags()

	const title = ref<string>('Create Artist Page')
	const description = ref<string>('Create Artist Page')

	const isUploadingEdit = ref<boolean>(false)

	const stylesList = ref<MusicStyle[]>([])
	const tagsList = ref<GeneralTag[]>([])
	const groupList = ref<Artist[]>([])
	const artistsList = ref<Artist[]>([])

	const artistImage = ref<string>('https://i.ibb.co/wLhbFZx/Frame-255.png')
	const artistName = ref<string>('')
	const artistIdYoutubeMusic = ref<string>('')
	const birthdayToDate = ref<Date | null>(null)
	const debutDateToDate = ref<Date | null>(null)

	const artistGroups = ref<MenuItem<Artist>[]>([])
	const artistMembers = ref<MenuItem<Artist>[]>([])
	const artistGender = ref<ArtistGender>('UNKNOWN')
	const artistType = ref<ArtistType>('SOLO')
	const artistActiveCareer = ref<boolean>(true)

	const artistStyles = ref<MenuItem<MusicStyle>[]>([])
	const artistTags = ref<MenuItem<GeneralTag>[]>([])
	const artistDescription = ref<string>('')
	const artistPlatformList = ref<
		Omit<ArtistPlatformLink, 'id' | 'created_at' | 'artist_id'>[]
	>([])
	const artistSocialList = ref<
		Omit<ArtistSocialLink, 'id' | 'created_at' | 'artist_id'>[]
	>([])

	const stylesForMenu = computed(() => {
		return stylesList.value.map(
			(style): MenuItem<MusicStyle> => ({
				...style,
				label: style.name,
			}),
		)
	})

	const tagsForMenu = computed(() => {
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

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium',
	})

	const parseToCalendarDate = (date: Date | null | undefined): CalendarDate | null => {
		if (!date) return null
		try {
			const year = date.getUTCFullYear()
			const month = date.getUTCMonth() + 1
			const day = date.getUTCDate()
			return new CalendarDate(year, month, day)
		} catch (e) {
			console.error('Failed to parse date:', date, e)
			return null
		}
	}

	const creationArtist = async () => {
		isUploadingEdit.value = true

		if (artistName.value === '') {
			toast.add({
				title: 'Please fill the required fields',
				description: 'Please fill the required fields',
				color: 'error',
			})
			isUploadingEdit.value = false
			return
		}

		const selectedGroups = artistGroups.value.map(({ label, ...rest }) => rest as Artist)
		const selectedMembers = artistMembers.value.map(
			({ label, ...rest }) => rest as Artist,
		)

		const artistStyleListName = artistStyles.value.map((style) => style.name)
		const artistTagListName = artistTags.value.map((tag) => tag.name)

		const artist: Omit<
			Artist,
			'id' | 'created_at' | 'updated_at' | 'social_links' | 'platform_links'
		> = {
			name: artistName.value,
			image: artistImage.value,
			description: artistDescription.value,
			id_youtube_music: artistIdYoutubeMusic.value,
			type: artistType.value,
			gender: artistGender.value,
			active_career: artistActiveCareer.value,
			verified: isAdminStore,
			// Re-convertir CalendarDate en ISO string
			birth_date: birthdayToDate.value ? birthdayToDate.value.toString() : null,
			debut_date: debutDateToDate.value ? debutDateToDate.value.toString() : null,
			styles: artistStyleListName,
			general_tags: artistTagListName,
		}

		createArtist(
			artist,
			artistSocialList.value,
			artistPlatformList.value,
			selectedGroups,
			selectedMembers,
		)
			.then((newArtist) => {
				isUploadingEdit.value = false
				toast.add({
					title: 'Artist created successfully',
					description: 'Artist created successfully',
					color: 'success',
				})
			})
			.catch((error) => {
				isUploadingEdit.value = false
				toast.add({
					title: 'Failed to create artist',
					description: error.message,
					color: 'error',
				})
			})
	}

	const closeModalCreateArtist = async () => {
		artistsList.value = await getAllArtists()
		groupList.value = artistsList.value.filter((artist) => artist.type === 'GROUP')
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
					class="bg-cb-primary-900 w-full rounded px-5 py-3 text-xs font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
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
					<p class="text-cb-quinary-900 text-sm italic">
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
				<div
					class="grid gap-5"
					:class="artistType == 'GROUP' ? 'grid-cols-1' : 'grid-cols-2'"
				>
					<!-- Birthday -->
					<div class="space-y-1" :class="{ hidden: artistType == 'GROUP' }">
						<ComebackLabel label="Birthday" />
						<UPopover>
							<UButton
								variant="subtle"
								icon="i-lucide-calendar"
								class="bg-cb-quaternary-950 text-tertiary w-full cursor-pointer ring-transparent"
							>
								{{ birthdayToDate ? df.format(birthdayToDate) : 'Select a date' }}
							</UButton>

							<template #content>
								<UCalendar
									class="bg-cb-quinary-900 rounded p-1"
									:model-value="parseToCalendarDate(birthdayToDate)"
									:min-date="new Date(1900, 0, 1)"
									@update:model-value="
										(value) => {
											if (value) {
												birthdayToDate = new Date(value.toString())
											} else {
												birthdayToDate = null
											}
										}
									"
								/>
							</template>
						</UPopover>
					</div>
					<!-- Debut Date -->
					<div class="space-y-1">
						<ComebackLabel label="Debut Date" />
						<UPopover>
							<UButton
								variant="subtle"
								icon="i-lucide-calendar"
								class="bg-cb-quaternary-950 text-tertiary w-full cursor-pointer ring-transparent"
							>
								{{ debutDateToDate ? df.format(debutDateToDate) : 'Select a date' }}
							</UButton>

							<template #content>
								<UCalendar
									class="bg-cb-quinary-900 rounded p-1"
									:model-value="parseToCalendarDate(debutDateToDate)"
									:min-date="new Date(2000, 0, 1)"
									@update:model-value="
										(value) => {
											if (value) {
												debutDateToDate = new Date(value.toString())
											} else {
												debutDateToDate = null
											}
										}
									"
								/>
							</template>
						</UPopover>
					</div>
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
						<p class="text-cb-quinary-900 text-sm italic">
							It's only for stat we don't assume any gender jugement
						</p>
					</div>
					<select
						v-model="artistGender"
						class="appearance-none border-b bg-transparent hover:cursor-pointer focus:outline-none"
					>
						<option default value="UNKNOWN" class="text-cb-secondary-950">UNKNOWN</option>
						<option value="MALE" class="text-cb-secondary-950">MALE</option>
						<option value="FEMALE" class="text-cb-secondary-950">FEMALE</option>
						<option value="MIXTE" class="text-cb-secondary-950">MIXTE</option>
					</select>
				</div>
				<!-- Type -->
				<div class="grid grid-cols-1 gap-1">
					<ComebackLabel label="Type" />
					<select
						v-model="artistType"
						class="appearance-none border-b bg-transparent hover:cursor-pointer focus:outline-none"
					>
						<option value="SOLO" class="text-cb-secondary-950">SOLO</option>
						<option value="GROUP" class="text-cb-secondary-950">GROUP</option>
					</select>
				</div>
				<!-- Active Career -->
				<div class="grid grid-cols-1 gap-1">
					<ComebackLabel label="Active Career" />
					<select
						v-model="artistActiveCareer"
						class="appearance-none border-b bg-transparent hover:cursor-pointer focus:outline-none"
					>
						<option :value="true" class="text-cb-secondary-950">Active</option>
						<option :value="false" class="text-cb-secondary-950">Inactive</option>
					</select>
				</div>
			</div>
			<!-- Styles & General Tags -->
			<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
				<!-- Styles -->
				<div v-if="stylesList" class="flex flex-col gap-1">
					<div class="flex justify-between gap-3">
						<ComebackLabel label="Styles" />
						<UModal
							:ui="{
								overlay: 'bg-cb-quinary-950/75',
								content: 'ring-cb-quinary-950',
							}"
						>
							<UButton
								label="Create New Style"
								variant="soft"
								class="bg-cb-primary-900 hover:bg-cb-primary-900/90 h-full cursor-pointer items-center justify-center rounded px-5 text-white"
							/>

							<template #content>
								<ModalCreateStyleTag :style-fetch="stylesList" />
							</template>
						</UModal>
					</div>
					<UInputMenu
						v-model="artistStyles"
						:items="stylesForMenu"
						by="id"
						multiple
						placeholder="Select styles"
						searchable
						searchable-placeholder="Search a style..."
						class="bg-cb-quaternary-950 text-tertiary w-full cursor-pointer ring-transparent"
						:ui="{
							content: 'bg-cb-quaternary-950',
							item: 'rounded cursor-pointer data-highlighted:before:bg-cb-primary-900/30 hover:bg-cb-primary-900',
						}"
					/>
				</div>
				<!-- General Tags -->
				<div v-if="tagsList" class="flex flex-col gap-1">
					<div class="flex justify-between gap-3">
						<ComebackLabel label="General Tags" />
						<UModal
							:ui="{
								overlay: 'bg-cb-quinary-950/75',
								content: 'ring-cb-quinary-950',
							}"
						>
							<UButton
								label="Create New Tag"
								variant="soft"
								class="bg-cb-primary-900 hover:bg-cb-primary-900/90 h-full cursor-pointer items-center justify-center rounded px-5 text-white"
							/>

							<template #content>
								<ModalCreateTag :general-tags="tagsList" />
							</template>
						</UModal>
					</div>
					<UInputMenu
						v-model="artistTags"
						:items="tagsForMenu"
						by="id"
						multiple
						placeholder="Select tags"
						searchable
						searchable-placeholder="Search a tag..."
						class="bg-cb-quaternary-950 text-tertiary w-full cursor-pointer ring-transparent"
						:ui="{
							content: 'bg-cb-quaternary-950',
							item: 'rounded cursor-pointer data-highlighted:before:bg-cb-primary-900/30 hover:bg-cb-primary-900',
						}"
					/>
				</div>
			</div>
			<!-- Description -->
			<div class="flex flex-col gap-1">
				<ComebackLabel label="Description" />
				<textarea
					v-model="artistDescription"
					placeholder="Description"
					class="focus:bg-cb-tertiary-200 focus:text-cb-secondary-950 min-h-full w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:p-1.5 focus:outline-none"
					@input="adjustTextarea($event)"
				/>
			</div>
			<!-- Group -->
			<div v-if="groupList" class="flex flex-col gap-1">
				<div class="flex justify-between gap-3">
					<ComebackLabel label="Group" />
					<UModal
						v-if="isAdminStore"
						:ui="{
							overlay: 'bg-cb-quinary-950/75',
							content: 'ring-cb-quinary-950',
						}"
					>
						<UButton
							label="Create New Artist"
							variant="soft"
							class="bg-cb-primary-900 hover:bg-cb-primary-900/90 h-full cursor-pointer items-center justify-center rounded px-5 text-white"
						/>

						<template #content>
							<ModalCreateArtist
								:styles-list="stylesList"
								:tags-list="tagsList"
								:group-list="groupList"
								:members-list="artistsList"
								@close-modal="closeModalCreateArtist"
							/>
						</template>
					</UModal>
				</div>
				<UInputMenu
					v-model="artistGroups"
					:items="groupsForMenu"
					by="id"
					multiple
					placeholder="Search a group"
					searchable
					searchable-placeholder="Search a group..."
					class="bg-cb-quaternary-950 text-tertiary w-full cursor-pointer ring-transparent"
					:ui="{
						content: 'bg-cb-quaternary-950',
						item: 'rounded cursor-pointer data-highlighted:before:bg-cb-primary-900/30 hover:bg-cb-primary-900',
					}"
				/>
			</div>
			<!-- Members -->
			<div v-if="artistsList && artistType == 'GROUP'" class="flex flex-col gap-1">
				<div class="flex justify-between gap-3">
					<ComebackLabel label="Members" />
					<UModal
						v-if="isAdminStore"
						:ui="{
							overlay: 'bg-cb-quinary-950/75',
							content: 'ring-cb-quinary-950',
						}"
					>
						<UButton
							label="Create New Artist"
							variant="soft"
							class="bg-cb-primary-900 hover:bg-cb-primary-900/90 h-full cursor-pointer items-center justify-center rounded px-5 text-white"
						/>

						<template #content>
							<ModalCreateArtist
								:styles-list="stylesList"
								:tags-list="tagsList"
								:group-list="groupList"
								:members-list="artistsList"
								@close-modal="closeModalCreateArtist"
							/>
						</template>
					</UModal>
				</div>
				<UInputMenu
					v-model="artistMembers"
					:items="membersForMenu"
					by="id"
					multiple
					placeholder="Search a member"
					searchable
					searchable-placeholder="Search a member..."
					class="bg-cb-quaternary-950 text-tertiary w-full cursor-pointer ring-transparent"
					:ui="{
						content: 'bg-cb-quaternary-950',
						item: 'rounded cursor-pointer data-highlighted:before:bg-cb-primary-900/30 hover:bg-cb-primary-900',
					}"
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
							@click="artistPlatformList.splice(artistPlatformList.indexOf(platform), 1)"
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
							@click="artistSocialList.splice(artistSocialList.indexOf(social), 1)"
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
				@click="creationArtist"
			>
				{{ isUploadingEdit ? 'Loading' : 'Saves' }}
			</button>
		</div>
	</div>
</template>
