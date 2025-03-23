<script setup>
	import VueMultiselect from 'vue-multiselect'
	import '@vuepic/vue-datepicker/dist/main.css'
	import VueDatePicker from '@vuepic/vue-datepicker'
	import { Timestamp, doc, onSnapshot } from 'firebase/firestore'
	import { useToast } from 'vue-toastification'
	import * as Mdl from '@kouts/vue-modal'
	import _ from 'lodash'
	import { useFirebaseArtist } from '~/composables/useFirebaseArtist'

	definePageMeta({
		middleware: 'auth',
	})

	const { Modal } = Mdl
	const route = useRoute()
	const router = useRouter()
	const toast = useToast()
	const { $firestore: db } = useNuxtApp()
	const { isAdminStore } = useUserStore()
	const { getArtistByIdWithGroupsAndMembers, updateArtist } = useFirebaseArtist()

	const title = ref('Edit Artist Page')
	const description = ref('Edit Artist Page')

	const isUploadingEdit = ref(false)
	const showModalCreateArtist = ref(false)
	const artist = ref(null)
	const groupList = ref(null)
	const membersList = ref(null)
	const artistList = ref(null)
	const stylesList = ref(null)
	const tagsList = ref(null)
	const birthdayToDateFormat = ref(null)
	const debutDateToDateFormat = ref(null)
	const artistToEdit = ref({
		id: '',
		idYoutubeMusic: '',
		name: '',
		type: '',
		description: '',
		image: '',
		gender: 'UNKNOWN',
		verified: true,
		activeCareer: true,
		birthDate: null,
		debutDate: null,
		platformList: [],
		socialList: [],
		styles: [],
		generalTags: [],
		groups: [],
		members: [],
	})

	const showModalCreateStyle = ref(false)
	const showModalCreateTag = ref(false)

	const compareFields = (field1, field2) => {
		return _.isEqual(field1, field2)
	}

	const sendUpdateArtist = async () => {
		// isUploadingEdit.value = true
		const updatedFields = {}

		Object.keys(artistToEdit.value).forEach((key) => {
			if (!compareFields(artistToEdit.value[key], artist.value[key])) {
				updatedFields[key] = artistToEdit.value[key]
			}
		})

		// if artistToEdit doesn't have any field to update then return
		if (Object.keys(updatedFields).length === 0) {
			toast.error('No field to update')
			return
		}

		const today = new Date()
		today.setDate(today.getDate())
		today.setHours(0, 0, 0, 0)
		const todayTimestamp = Timestamp.fromDate(today)
		updatedFields.updatedAt = todayTimestamp

		if (isAdminStore) {
			// update artist without verifying
			updatedFields.id = artist.value.id
			updateArtist(updatedFields).then(async () => {
				toast.success('Artist Updated')
				router.push(`/artist/${route.params.id}`)
			})
		} else {
			// addd pending artist
			add('updateArtistPending', updatedFields)
				.then(() => {
					isUploadingEdit.value = false
					toast.success('Artist Update')
					router.push(`/artist/${route.params.id}`)
				})
				.catch((error) => {
					console.error('Error writing document: ', error)
					toast.warning('Artist Update Failed')
				})
		}
	}

	const closeModalCreateArtist = async () => {
		artistList.value = await queryByCollection('artists')
		groupList.value = artistList.value.filter((artist) => artist.type == 'GROUP')
		membersList.value = artistList.value
		showModalCreateArtist.value = false
	}

	const adjustTextarea = (event) => {
		const textarea = event.target || event // Cibler le textarea via `ref` ou l'événement d'entrée
		textarea.style.height = 'auto' // Réinitialise la hauteur pour recalculer correctement
		textarea.style.height = `${textarea.scrollHeight}px` // Ajuste la hauteur à la hauteur de contenu
	}

	watch(birthdayToDateFormat, () => {
		if (birthdayToDateFormat.value) {
			const tmpDate = new Date(birthdayToDateFormat.value)
			tmpDate.setHours(0, 0, 0, 0)
			artistToEdit.value.birthDate = Timestamp.fromDate(tmpDate)
		} else {
			artistToEdit.value.birthDate = null
		}
	})

	watch(debutDateToDateFormat, () => {
		if (debutDateToDateFormat.value) {
			const tmpDate = new Date(debutDateToDateFormat.value)
			tmpDate.setHours(0, 0, 0, 0)
			artistToEdit.value.debutDate = Timestamp.fromDate(tmpDate)
		} else {
			artistToEdit.value.debutDate = null
		}
	})

	const closeModalCreateStyle = () => {
		showModalCreateStyle.value = false
	}

	const closeModalCreateTag = () => {
		showModalCreateTag.value = false
	}

	onMounted(async () => {
		artist.value = await getArtistByIdWithGroupsAndMembers(route.params.id)
		artistToEdit.value = await getArtistByIdWithGroupsAndMembers(route.params.id)

		birthdayToDateFormat.value = artist.value.birthDate
			? artist.value.birthDate.toDate()
			: null
		debutDateToDateFormat.value = artist.value.debutDate
			? artist.value.debutDate.toDate()
			: null

		title.value = 'EDIT ARTIST : ' + artist.value.name
		description.value = artist.value.description

		artistList.value = await queryByCollection('artists')
		groupList.value = artistList.value.filter((artist) => artist.type === 'GROUP')
		membersList.value = artistList.value

		onSnapshot(doc(db, 'general', 'data'), (doc) => {
			if (!doc.exists()) return

			stylesList.value = doc?.data().styles
			tagsList.value = doc?.data().generalTags

			stylesList.value.sort((a, b) => {
				return a.name.localeCompare(b.name)
			})

			tagsList.value.sort((a, b) => {
				return a.name.localeCompare(b.name)
			})
		})

		const textarea = document.querySelector('textarea') // Vous pouvez aussi utiliser this.$refs si applicable
		if (textarea) {
			adjustTextarea(textarea)
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
		v-if="artist"
		class="container mx-auto min-h-[calc(100vh-60px)] space-y-5 p-5 lg:px-10"
	>
		<div
			class="flex items-end justify-between border-b border-zinc-700 pb-1 text-lg font-semibold uppercase lg:text-xl"
		>
			<p>Artist Edition : {{ artistToEdit.name }}</p>
			<button
				:disabled="isUploadingEdit"
				class="w-fit rounded bg-primary px-3 py-1 text-base font-semibold uppercase transition-all duration-300 ease-in-out hover:scale-105 hover:bg-red-900"
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
					v-model="artistToEdit.idYoutubeMusic"
					label="Id Youtube Music"
					:placeholder="artist.idYoutubeMusic"
				/>
				<!-- Birthday & Debut Date -->
				<div
					class="grid grid-cols-1 gap-5"
					:class="{ 'md:grid-cols-2': artistToEdit.type == 'SOLO' }"
				>
					<div class="space-y-1" :class="{ hidden: artistToEdit.type == 'GROUP' }">
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
							v-for="gender in ['UNKNOWN', 'MALE', 'FEMALE', 'MIXTE']"
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
							v-for="type in ['SOLO', 'GROUP']"
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
							:key="status.value"
							class="flex w-full items-center gap-2"
						>
							<input
								:id="status.label"
								v-model="artistToEdit.activeCareer"
								type="radio"
								:value="status.value"
								class="hidden"
							/>
							<button
								class="w-full rounded px-3 py-1 text-sm"
								:class="
									artistToEdit.activeCareer === status.value
										? 'bg-primary text-white'
										: 'bg-quaternary'
								"
								@click="artistToEdit.activeCareer = status.value"
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
							class="w-fit rounded bg-primary px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
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
							class="w-fit rounded bg-primary px-2 py-1 text-xs font-semibold uppercase hover:bg-red-900"
							@click="showModalCreateTag = true"
						>
							Create New Tag
						</button>
					</div>
					<VueMultiselect
						v-model="artistToEdit.generalTags"
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
					v-model="artistToEdit.groups"
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
			<div v-if="membersList && artistToEdit.type != 'SOLO'" class="flex flex-col gap-1">
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
					v-model="artistToEdit.members"
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
						v-for="(platform, index) in artistToEdit.platformList"
						:key="platform"
						class="flex w-full gap-1"
					>
						<div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
							<input
								type="text"
								:value="platform.name"
								placeholder="Platform's Name"
								class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
								@input="artistToEdit.platformList[index].name = $event.target.value"
							/>
							<input
								type="text"
								:value="platform.link"
								placeholder="Platform's Link"
								class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
								@input="artistToEdit.platformList[index].link = $event.target.value"
							/>
						</div>
						<button
							class="rounded bg-primary p-5 text-xs hover:bg-red-900"
							@click="
								artistToEdit.platformList.splice(
									artistToEdit.platformList.indexOf(platform),
									1,
								)
							"
						>
							Delete
						</button>
					</div>
					<button
						class="w-full rounded bg-primary p-2 text-xs font-semibold uppercase hover:bg-red-900"
						@click="artistToEdit.platformList.push({ name: '', link: '' })"
					>
						Add Platforms
					</button>
				</div>
				<!-- Socials -->
				<div class="w-full space-y-2">
					<ComebackLabel label="Socials" />
					<div
						v-for="(social, index) in artistToEdit.socialList"
						:key="social"
						class="flex w-full gap-2"
					>
						<div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
							<input
								type="text"
								:value="social.name"
								placeholder="Social's Name"
								class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
								@input="artistToEdit.socialList[index].name = $event.target.value"
							/>
							<input
								type="text"
								:value="social.link"
								placeholder="Social's Link"
								class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
								@input="artistToEdit.socialList[index].link = $event.target.value"
							/>
						</div>
						<button
							class="rounded bg-primary p-5 text-xs hover:bg-red-900"
							@click="
								artistToEdit.socialList.splice(
									artistToEdit.socialList.indexOf(platform),
									1,
								)
							"
						>
							Delete
						</button>
					</div>
					<button
						class="w-full rounded bg-primary p-2 text-xs font-semibold uppercase hover:bg-red-900"
						@click="artistToEdit.socialList.push({ name: '', link: '' })"
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
