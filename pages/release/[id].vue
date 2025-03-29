<script setup lang="ts">
	import * as Mdl from '@kouts/vue-modal'
	import VueDatePicker from '@vuepic/vue-datepicker'
	import { useToast } from 'vue-toastification'
	import { useUserStore } from '@/stores/user'
	import { type Release } from '@/types/supabase/release'
	import { useSupabaseRelease } from '~/composables/Supabase/useSupabaseRelease'
	import { useSupabaseMusic } from '~/composables/Supabase/useSupabaseMusic'

	const { Modal } = Mdl
	const { getReleaseById, getSuggestedReleases, updateRelease } = useSupabaseRelease()
	const { updateMusic } = useSupabaseMusic()
	const { isLoginStore } = useUserStore()
	const toast = useToast()
	const route = useRoute()
	const router = useRouter()

	const title = ref('Release Page')
	const description = ref('Release')

	const showModal = ref(false)
	const showModalEdit = ref(false)
	const sendNewStreamingPlatform = ref(false)
	const newStreamingPlatform = ref({
		name: '',
		link: '',
	})
	const dateToDateFormat = ref(null)

	const release = ref<Release | null>(null)
	const suggestedReleases = ref<Release[]>([])
	const imageLoaded = ref(false)
	const isLoading = ref(true)
	const musicList = ref<Music[]>([])

	watch(
		() => release.value?.musics,
		(newMusics) => {
			console.log('Musics changed:', toRaw(newMusics))
		},
		{ deep: true },
	)

	const createNewPlatformStreaming = async () => {
		if (!release.value) return
		sendNewStreamingPlatform.value = true

		const tmp = [...(release.value.platformList || [])]
		tmp.push(newStreamingPlatform.value)

		await updateRelease(release.value.id, {
			platformList: tmp,
		})

		sendNewStreamingPlatform.value = false
		showModal.value = false

		newStreamingPlatform.value = {
			name: '',
			link: '',
		}
	}

	const updateReleaseFunction = async (releaseId: string, releaseParam: any) => {
		const releaseData: Partial<Release> = {
			name: releaseParam.name,
			type: releaseParam.type,
			year: releaseParam.year,
			date: releaseParam.date,
		}

		try {
			await updateRelease(releaseId, releaseData)

			// On utilise les musiques directement depuis release.value qui est réactif
			const updatePromises =
				release.value?.musics.map(async (music: any) => {
					// Trouver la version originale de la musique
					const originalMusic = musicList.value.find((m) => m.id === music.id)
					
					// Vérifier si des modifications ont été apportées
					if (
						originalMusic &&
						(music.name !== originalMusic.name ||
							music.ismv !== originalMusic.ismv ||
							music.id_youtube_music !== originalMusic.id_youtube_music)
					) {
						return updateMusic(music.id, {
							name: music.name,
							ismv: music.ismv,
							id_youtube_music: music.id_youtube_music,
						})
					}
					return Promise.resolve()
				}) || []

			// Attendre que toutes les mises à jour soient terminées
			await Promise.all(updatePromises)

			toast.info('Release updated')
			showModalEdit.value = false
		} catch (error) {
			console.error('Error updating release:', error)
			toast.error('Une erreur est survenue lors de la mise à jour')
		}
	}

	const verifyShowModal = () => {
		if (isLoginStore) {
			showModal.value = true
		} else {
			router.push('/authentification')
		}
	}

	const editRelease = async () => {
		if (isLoginStore) {
			showModalEdit.value = true
		} else {
			router.push('/authentification')
		}
	}

	onMounted(async () => {
		try {
			isLoading.value = true

			release.value = await getReleaseById(route.params.id as string)

			if (release.value) {
				title.value = release.value.name + ' par ' + release.value.artists[0].name
				description.value = release.value.description

				// Copie profonde des musiques pour conserver l'état initial
				musicList.value = release.value.musics.map((music) => ({
					id: music.id,
					name: music.name,
					ismv: music.ismv,
					id_youtube_music: music.id_youtube_music,
				}))
				
				// Récupérer les suggestions
				suggestedReleases.value = await getSuggestedReleases(
					release.value.artists[0].id,
					release.value.id,
				)
			}
		} catch (error: any) {
			if (error.statusCode === 404) {
				throw error
			}
			console.error('Error loading release:', error)
			throw createError({
				statusCode: 500,
				statusMessage: 'Une erreur est survenue lors du chargement de la release',
			})
		} finally {
			isLoading.value = false
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
	<div>
		<div v-if="isLoading" class="container p-5 mx-auto space-y-12">
			<section class="space-y-2">
				<SkeletonDefault class="w-3/4 h-3 rounded-full" />
				<SkeletonDefault class="w-full h-3 rounded-full" />
				<SkeletonDefault class="w-full h-3 rounded-full" />
				<SkeletonDefault class="w-3/4 h-3 rounded-full" />
				<SkeletonDefault class="w-2/4 h-3 rounded-full" />
			</section>
		</div>

		<template v-else-if="release">
			<!--  Header Release -->
			<section class="relative h-fit">
				<!-- Header Image -->
				<div class="relative h-fit min-h-[20rem] lg:max-h-[30rem] lg:min-h-[30rem]">
					<div
						class="absolute inset-0 min-h-[20rem] w-full transition-all duration-700 ease-in-out lg:max-h-[30rem] lg:min-h-[30rem]"
						:class="imageLoaded ? 'bg-black opacity-30' : 'bg-primary opacity-100'"
					/>
					<NuxtImg
						v-if="release.image"
						format="webp"
						preload
						:src="release.image"
						:alt="release.name"
						class="max-h-[20rem] min-h-[20rem] w-full object-cover lg:max-h-[30rem] lg:min-h-[30rem]"
						@load="imageLoaded = true"
					/>
				</div>
				<!-- Header Data-->
				<div
					class="z-10 flex flex-col justify-end p-5 space-y-3 transition-all duration-300 ease-in-out md:absolute md:inset-0 md:min-h-full md:justify-center md:bg-secondary/50"
				>
					<div class="container mx-auto flex items-center gap-5 space-y-2.5 lg:items-end">
						<NuxtImg
							v-if="release.image"
							format="webp"
							preload
							:alt="release.name"
							:src="release.image"
							class="hidden aspect-square max-w-[12rem] rounded bg-primary md:block lg:max-w-[20rem]"
						/>
						<SkeletonDefault
							v-else
							class="hidden aspect-square min-w-[12rem] max-w-[12rem] rounded md:block lg:min-w-[20rem] lg:max-w-[20rem]"
						/>
						<div class="mt-auto space-y-3">
							<div class="space-y-2">
								<h1 class="text-2xl font-black lg:text-5xl 2xl:text-7xl">
									{{ release.name }}
								</h1>
								<div class="flex items-center gap-2">
									<NuxtLink
										:to="`/artist/${release.artists[0].id}`"
										class="flex items-center gap-2 rounded-full transition-all duration-300 ease-in-out hover:bg-secondary hover:px-3 hover:py-0.5"
									>
										<p class="text-sm font-semibold">
											{{ release.artists[0].name }}
										</p>
									</NuxtLink>
									<p>-</p>
									<p>{{ release.type }}</p>
									<p>-</p>
									<p>{{ release.year }}</p>
								</div>
								<button
									class="px-2 py-1 text-sm rounded bg-quaternary hover:bg-tertiary/10"
									@click="editRelease"
								>
									Edit
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="container p-5 py-5 mx-auto space-y-12 md:px-10 xl:px-0">
				<!-- Platforms -->
				<!-- <section v-if="release.platformList?.length" class="space-y-2">
					<p class="font-black">Streaming Platforms</p>
					<div class="flex gap-1.5">
						<ComebackExternalLink
							v-for="social in release.platformList"
							:key="social.name"
							:name="social.name"
							:link="social.link"
						/>
						<button
							class="flex items-center gap-2 rounded bg-quaternary px-3.5 py-2.5 text-sm hover:bg-quinary"
							@click="verifyShowModal()"
						>
							<IconPlus class="w-5 h-5" />
							<p>Add Streaming Platform</p>
						</button>
					</div>
				</section> -->
				<!-- Musics -->
				<section v-if="release.musics?.length" class="space-y-2">
					<CardDefault :name="`Tracks (${release.musics?.length})`">
						<transition-group name="list-complete" tag="div" class="space-y-2">
							<MusicDisplay
								v-for="song in release.musics"
								:key="song.id"
								:artist-id="release.artists[0].id"
								:artist-name="release.artists[0].name"
								:music-id="song.id_youtube_music"
								:music-name="song.name"
								:has-mv="song.ismv"
								:music-image="song.thumbnails[2].url"
								:duration="song.duration"
								class="w-full bg-quinary"
							/>
						</transition-group>
					</CardDefault>
				</section>

				<!-- Suggestions -->
				<section v-if="suggestedReleases.length" class="space-y-2">
					<CardDefault :name="`Autres releases de ${release.artists[0].name}`">
						<div class="flex gap-4">
							<CardObject
								v-for="otherRelease in suggestedReleases"
								:key="otherRelease.id"
								:artist-id="otherRelease.artists[0].id"
								:main-title="otherRelease.name"
								:sub-title="otherRelease.artists[0].name"
								:image="otherRelease.image"
								:release-date="otherRelease.date"
								:release-type="otherRelease.type"
								:object-link="`/release/${otherRelease.id}`"
								is-release-display
							/>
						</div>
					</CardDefault>
				</section>
			</section>

			<Modal
				v-model="showModal"
				title="Add a Streaming Platforms"
				wrapper-class="animate__animated modal-wrapper"
				:modal-style="{
					background: '#1F1D1D',
					'border-radius': '0.25rem',
					color: 'white',
				}"
				:in-class="`animate__fadeInDown`"
				:out-class="`animate__bounceOut`"
				bg-class="animate__animated"
				:bg-in-class="`animate__fadeInUp`"
				:bg-out-class="`animate__fadeOutDown`"
			>
				<div class="space-y-3">
					<ComebackInput v-model="newStreamingPlatform.name" label="Name" />
					<ComebackInput v-model="newStreamingPlatform.link" label="Link" />
					<button
						:disabled="sendNewStreamingPlatform"
						class="w-full py-2 font-semibold uppercase transition-all duration-300 ease-in-out rounded bg-primary hover:scale-105 hover:bg-red-900"
						@click="createNewPlatformStreaming"
					>
						<p v-if="sendNewStreamingPlatform">Sending...</p>
						<p v-else>Send News</p>
					</button>
				</div>
			</Modal>

			<Modal
				v-model="showModalEdit"
				title="Edit Release"
				wrapper-class="animate__animated modal-wrapper"
				:modal-style="{
					background: '#1F1D1D',
					'border-radius': '0.25rem',
					color: 'white',
				}"
				:in-class="`animate__fadeInDown`"
				:out-class="`animate__bounceOut`"
				bg-class="animate__animated"
				:bg-in-class="`animate__fadeInUp`"
				:bg-out-class="`animate__fadeOutDown`"
			>
				<div class="space-y-3">
					<ComebackInput v-model="release.name" label="Name" />

					<div class="grid grid-cols-2 gap-3">
						<ComebackInput v-model="release.artistsName" label="Artist Name" disabled />

						<div class="grid grid-cols-1 gap-1">
							<ComebackLabel label="Type" />
							<select
								v-model="release.type"
								class="rounded border border-transparent bg-quaternary px-2 py-1.5 transition-all duration-150 ease-in-out hover:cursor-pointer focus:border-primary focus:outline-none"
							>
								<option value="ALBUM">ALBUM</option>
								<option value="EP">EP</option>
								<option value="SINGLE">SINGLE</option>
							</select>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<ComebackInput v-model="release.year" label="Year" />
						<div class="flex flex-col gap-1">
							<ComebackLabel label="Date" />
							<VueDatePicker
								v-model="dateToDateFormat"
								placeholder="Select Date"
								auto-apply
								:enable-time-picker="false"
								dark
							/>
						</div>
					</div>

					<div class="flex flex-col gap-1">
						<ComebackLabel label="Tracklist" />
						<div class="space-y-2">
							<div
								v-for="music in release.musics"
								:key="music.videoId"
								class="py-1 pl-2 pr-1 space-y-1 rounded bg-quinary"
							>
								<div class="flex items-center justify-between w-full gap-2">
									<p>{{ music.name }}</p>
									<div
										class="flex items-center gap-2 px-2 py-1 text-xs rounded w-fit bg-quaternary"
									>
										<label class="whitespace-nowrap">Has MV</label>
										<input type="checkbox" v-model="music.ismv" />
									</div>
								</div>
								<ComebackInput v-if="music.ismv" v-model="music.id_youtube_music" />
							</div>
						</div>
					</div>

					<button
						class="w-full py-2 font-semibold uppercase transition-all duration-300 ease-in-out rounded bg-primary hover:scale-105 hover:bg-red-900"
						@click="updateReleaseFunction(release.id, release)"
					>
						<p>Update Release</p>
					</button>
				</div>
			</Modal>
		</template>
	</div>
</template>
