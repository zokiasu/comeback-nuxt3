<script setup lang="ts">
	import { useUserStore } from '@/stores/user'
	import { type Artist } from '@/types/artist'
	import type { Music } from '~/types/music'

	const { isLoginStore } = useUserStore()
	const { getRandomMusicFromArtistId } = useFirebaseFunction()
	const { getFullArtistById } = useFirebaseArtist()

	const title = ref('Artist Page')
	const description = ref('Artist')
	const route = useRoute()
	const artist = ref<Artist>({} as Artist)
	const imageBackground = ref('')
	const imageBackLoaded = ref(false)
	const isFetchingArtist = ref(true)
	const musicDiscover = ref([] as Music[])

	onMounted(async () => {
		try {
			const fetchedArtist = await getFullArtistById(route.params.id as any)
			artist.value = fetchedArtist
			imageBackground.value = fetchedArtist.image
			title.value = fetchedArtist.name
			description.value = fetchedArtist.description
			if (artist.value.idYoutubeMusic) {
				const fetchedMusicDiscover = await getRandomMusicFromArtistId(
					artist.value.id,
					artist.value.name,
				)
				musicDiscover.value = fetchedMusicDiscover as Music[]
			}
		} catch (error) {
			console.error(error)
			isFetchingArtist.value = false
		} finally {
			isFetchingArtist.value = false
		}
	})

	const members = computed(
		() => artist.value?.members?.filter((member) => member.type === 'SOLO') || [],
	)
	const subUnitMembers = computed(
		() => artist.value?.members?.filter((member) => member.type === 'GROUP') || [],
	)
	const singleRelease = computed(() => {
		const singles =
			artist.value?.releases?.filter((release) => release.type === 'SINGLE') || []
		return singles.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0))
	})

	const albumEpRelease = computed(() => {
		const albums =
			artist.value?.releases?.filter((release) => release.type !== 'SINGLE') || []
		return albums.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0))
	})

	const editLink = computed(() => {
		if (!isLoginStore) {
			return '/authentification'
		}
		return '/artist/edit/' + route.params.id
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
		<section
			class="background-top relative h-[30vh] overflow-hidden bg-cover bg-no-repeat lg:h-[40vh] xl:h-[50vh] 2xl:h-[70vh]"
		>
			<NuxtImg
				v-if="imageBackground"
				:src="imageBackground"
				:alt="artist.name + '_back'"
				format="webp"
				loading="lazy"
				class="absolute inset-0 h-full w-full object-cover"
				@load="imageBackLoaded = true"
			/>
			<div
				class="absolute inset-0 flex items-end p-5 transition-all duration-500 ease-in-out lg:p-10 xl:p-14 2xl:px-32"
				:class="imageBackLoaded ? 'bg-secondary/60' : 'bg-quinary'"
			>
				<div class="space-y-5 lg:container lg:mx-auto lg:px-5">
					<SkeletonDefault v-if="isFetchingArtist" class="h-14 w-80 rounded" />
					<h1
						v-if="artist.name && !isFetchingArtist"
						class="text-3xl font-bold md:text-6xl xl:text-7xl"
					>
						{{ artist.name }}
					</h1>
					<div
						v-if="artist.birthDate || artist.debutDate"
						class="flex flex-wrap gap-2 font-semibold"
					>
						<p
							v-if="artist.birthDate"
							class="w-fit whitespace-nowrap rounded bg-quaternary px-3 py-1 text-xs font-semibold uppercase"
						>
							Birthday :
							{{
								artist.birthDate
									? artist.birthDate.toDate().toLocaleDateString('en-US', {
											day: 'numeric',
											month: 'long',
											year: 'numeric',
										})
									: 'Unknown'
							}}
						</p>
						<p
							v-if="artist.debutDate"
							class="w-fit whitespace-nowrap rounded bg-quaternary px-3 py-1 text-xs font-semibold uppercase"
						>
							Debut Date :
							{{
								artist.debutDate
									? artist.debutDate.toDate().toLocaleDateString('en-US', {
											day: 'numeric',
											month: 'long',
											year: 'numeric',
										})
									: 'Unknown'
							}}
						</p>
					</div>
					<div v-if="!isFetchingArtist" class="flex flex-wrap gap-2">
						<p
							v-for="style in artist.styles"
							:key="style.name"
							class="w-fit whitespace-nowrap rounded bg-quaternary px-3 py-1 text-xs font-semibold uppercase"
						>
							{{ style.name }}
						</p>
						<p
							v-for="tag in artist.generalTags"
							:key="tag.name"
							class="w-fit whitespace-nowrap rounded bg-quaternary px-3 py-1 text-xs font-semibold uppercase"
						>
							{{ tag.name }}
						</p>
					</div>
					<div v-if="!isFetchingArtist" class="flex flex-wrap gap-2">
						<p
							v-if="!artist.activeCareer"
							class="w-fit bg-quaternary px-2 py-1 text-xs font-semibold uppercase"
						>
							Inactive (Withdrawn/Disband/Not Debuted)
						</p>
						<NuxtLink
							:to="editLink"
							class="bg-secondary px-2 py-1 text-xs font-semibold uppercase"
						>
							Edit Artist
						</NuxtLink>
					</div>
				</div>
			</div>
		</section>

		<section
			class="mx-auto space-y-8 p-5 py-8 lg:container lg:space-y-14 lg:px-14 lg:py-10 xl:px-5"
		>
			<div v-if="isFetchingArtist" class="space-y-2">
				<SkeletonDefault class="h-5 w-3/4 rounded" />
				<SkeletonDefault class="h-5 w-2/4 rounded" />
				<SkeletonDefault class="h-5 w-2/6 rounded" />
				<SkeletonDefault class="h-5 w-2/5 rounded" />
			</div>

			<div v-else class="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-10">
				<div class="space-y-5" :class="artist.releases ? 'col-span-2' : 'col-span-full'">
					<CardDefault
						v-if="artist.platformList?.length && !isFetchingArtist"
						name="Streaming Platforms"
					>
						<div class="flex flex-wrap gap-2">
							<LazyComebackExternalLink
								v-for="platform in artist.platformList"
								:key="platform.link"
								:name="platform.name"
								:link="platform.link"
								class="!px-2.5 !py-1"
							/>
						</div>
					</CardDefault>
					<div v-if="isFetchingArtist" class="flex gap-2">
						<SkeletonDefault
							v-for="i in 3"
							:key="`skeleton_platforms_` + i"
							class="h-6 w-20 rounded"
						/>
					</div>
					<CardDefault
						v-if="artist.socialList?.length && !isFetchingArtist"
						name="Socials Media"
					>
						<div class="flex flex-wrap gap-2">
							<LazyComebackExternalLink
								v-for="social in artist.socialList"
								:key="social.link"
								:name="social.name"
								:link="social.link"
								class="!px-2.5 !py-1"
							/>
						</div>
					</CardDefault>
					<div v-if="isFetchingArtist" class="flex gap-2">
						<SkeletonDefault
							v-for="i in 3"
							:key="`skeleton_socials_` + i"
							class="h-6 w-20 rounded"
						/>
					</div>
					<CardDefault name="Description">
						<p
							v-if="artist.description"
							class="max-w-6xl whitespace-pre-line text-xs leading-6 md:text-base md:leading-8"
						>
							{{ artist.description }}
						</p>
						<div v-else>
							<p class="text-xs md:text-base">No description.</p>
							<p class="text-xs md:text-base">
								Write a description to share more information about this artist with our
								community.
							</p>
							<div class="pt-2">
								<NuxtLink
									:to="editLink"
									class="mt-5 bg-quaternary px-2 py-1 text-xs font-semibold uppercase"
								>
									Add a description
								</NuxtLink>
							</div>
						</div>
					</CardDefault>
				</div>
				<div v-if="artist.idYoutubeMusic && musicDiscover">
					<CardDefault name="Discover Music">
						<div v-if="musicDiscover.length < 1" class="space-y-2">
							<SkeletonDefault class="h-14 w-full rounded" />
							<SkeletonDefault class="h-14 w-full rounded" />
							<SkeletonDefault class="h-14 w-full rounded" />
							<SkeletonDefault class="h-14 w-full rounded" />
							<SkeletonDefault class="h-14 w-full rounded" />
						</div>
						<transition-group
							v-else-if="musicDiscover.length > 0"
							name="list-complete"
							tag="div"
							class="space-y-2"
						>
							<MusicDisplay
								v-for="song in musicDiscover"
								:key="song.videoId"
								:artist-id="''"
								:artist-name="artist.name"
								:music-id="song.videoId"
								:music-name="song.name"
								:music-image="song.thumbnails[2].url"
								:duration="song?.duration?.toString() || '0'"
								class="w-full bg-quinary"
							/>
						</transition-group>
					</CardDefault>
				</div>
			</div>

			<div v-if="members?.length && !isFetchingArtist">
				<CardDefault name="Members">
					<transition-group
						name="list-complete"
						tag="div"
						class="scrollBarLight flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 xl:flex-wrap"
					>
						<CardObject
							v-for="soloMember in members"
							:key="`artistMembers_` + soloMember.id"
							is-artist
							:artist-id="soloMember.id"
							:main-title="soloMember.name"
							:image="soloMember.image"
							:object-link="`/artist/${soloMember.id}`"
						/>
					</transition-group>
				</CardDefault>
			</div>

			<div v-if="albumEpRelease?.length && !isFetchingArtist">
				<CardDefault name="Albums/Eps">
					<transition-group
						name="list-complete"
						tag="div"
						class="scrollBarLight flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 xl:flex-wrap"
					>
						<CardObject
							v-for="release in albumEpRelease"
							:key="release.idYoutubeMusic"
							:artist-id="release.artistsId"
							:main-title="release.name"
							:image="release.image"
							:release-date="release.date"
							:release-type="release.type"
							:object-link="`/release/${release.idYoutubeMusic}`"
							is-release-display
							date-always-display
						/>
					</transition-group>
				</CardDefault>
			</div>

			<div v-if="singleRelease?.length && !isFetchingArtist">
				<CardDefault name="Singles">
					<transition-group
						name="list-complete"
						tag="div"
						class="scrollBarLight flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 xl:flex-wrap"
					>
						<CardObject
							v-for="release in singleRelease"
							:key="release.idYoutubeMusic"
							:artist-id="release.artistsId"
							:main-title="release.name"
							:image="release.image"
							:release-date="release.date"
							:release-type="release.type"
							:object-link="`/release/${release.idYoutubeMusic}`"
							is-release-display
							date-always-display
						/>
					</transition-group>
				</CardDefault>
			</div>

			<div v-if="subUnitMembers?.length && !isFetchingArtist">
				<CardDefault name="Subunit">
					<transition-group
						name="list-complete"
						tag="div"
						class="scrollBarLight flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 xl:flex-wrap"
					>
						<CardObject
							v-for="groupMember in subUnitMembers"
							:key="`artistMembers_` + groupMember.id"
							is-artist
							:artist-id="groupMember.id"
							:main-title="groupMember.name"
							:image="groupMember.image"
							:object-link="`/artist/${groupMember.id}`"
						/>
					</transition-group>
				</CardDefault>
			</div>

			<div v-if="artist.groups?.length && !isFetchingArtist">
				<CardDefault name="Group">
					<transition-group
						name="list-complete"
						tag="div"
						class="scrollBarLight flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 xl:flex-wrap"
					>
						<CardObject
							v-for="group in artist.groups"
							:key="`artistMembers_` + group.id"
							is-artist
							:artist-id="group.id"
							:main-title="group.name"
							:image="group.image"
							:object-link="`/artist/${group.id}`"
						/>
					</transition-group>
				</CardDefault>
			</div>
		</section>
	</div>
</template>
