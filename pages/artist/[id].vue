<script setup lang="ts">
	import { storeToRefs } from 'pinia'
	import { useUserStore } from '@/stores/user'
	import type { Artist, Music, ArtistSocialLink, ArtistPlatformLink } from '~/types'
	import { useSupabaseArtist } from '~/composables/Supabase/useSupabaseArtist'
	import { useSupabaseMusic } from '~/composables/Supabase/useSupabaseMusic'

	const userStore = useUserStore()
	const { isLoginStore, isAdminStore } = storeToRefs(userStore)
	const { getFullArtistById, getSocialAndPlatformLinksByArtistId } = useSupabaseArtist()
	const { getRandomMusicsByArtistId } = useSupabaseMusic()

	const title = ref<string>('Artist Page')
	const description = ref<string>('Artist')
	const route = useRoute()
	const artist = ref<Artist>()
	const socialLinksList = ref<ArtistSocialLink[]>([])
	const platformLinksList = ref<ArtistPlatformLink[]>([])
	const imageBackground = ref<string | null>(null)
	const imageBackLoaded = ref<boolean>(false)
	const isFetchingArtist = ref<boolean>(true)
	const musicDiscover = ref<Music[]>([])

	onMounted(async () => {
		try {
			artist.value = await getFullArtistById(route.params.id as string)
			if (artist.value) {
				const { socialLinks, platformLinks } = await getSocialAndPlatformLinksByArtistId(
					artist.value.id,
				)
				socialLinksList.value = socialLinks
				platformLinksList.value = platformLinks
				imageBackground.value = artist.value.image
				title.value = artist.value.name
				description.value = artist.value.description || ''
				musicDiscover.value = await getRandomMusicsByArtistId(artist.value.id, 9)
			}
		} catch (error) {
			console.error(error)
			isFetchingArtist.value = false
		} finally {
			isFetchingArtist.value = false
		}
	})

	const members = computed(
		() =>
			artist.value?.members
				?.filter((member) => member.type === 'SOLO')
				.sort((a, b) => a.name.localeCompare(b.name)) || [],
	)

	const subUnitMembers = computed(
		() =>
			artist.value?.members
				?.filter((member) => member.type === 'GROUP')
				.sort((a, b) => a.name.localeCompare(b.name)) || [],
	)

	const singleRelease = computed(() => {
		const singles =
			artist.value?.releases?.filter((release) => release.type === 'SINGLE') || []
		singles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		return singles
	})

	const albumEpRelease = computed(() => {
		const albums =
			artist.value?.releases?.filter((release) => release.type !== 'SINGLE') || []
		albums.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		return albums
	})

	const editLink = computed(() => {
		if (!isLoginStore || !isAdminStore) {
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
	<div v-if="artist">
		<section
			class="background-top relative h-[30vh] overflow-hidden bg-cover bg-no-repeat lg:h-[40vh] xl:h-[50vh] 2xl:h-[70vh]"
		>
			<NuxtImg
				v-if="imageBackground"
				:src="imageBackground"
				:alt="artist?.name + '_background'"
				format="webp"
				loading="lazy"
				class="absolute inset-0 h-full w-full object-cover"
				@load="imageBackLoaded = true"
			/>
			<div
				class="absolute inset-0 flex items-end p-5 transition-all duration-500 ease-in-out lg:p-10 xl:p-14 2xl:px-32"
				:class="imageBackLoaded ? 'bg-cb-secondary-950/60' : 'bg-cb-quinary-900'"
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
						v-if="artist.birth_date || artist.debut_date"
						class="flex flex-wrap gap-2 font-semibold"
					>
						<p
							v-if="artist.birth_date"
							class="bg-cb-quaternary-950 w-fit rounded px-3 py-1 text-xs font-semibold whitespace-nowrap uppercase"
						>
							Birthday :
							{{
								artist.birth_date
									? new Date(artist.birth_date).toLocaleDateString('en-US', {
											day: 'numeric',
											month: 'long',
											year: 'numeric',
										})
									: 'Unknown'
							}}
						</p>
						<p
							v-if="artist.debut_date"
							class="bg-cb-quaternary-950 w-fit rounded px-3 py-1 text-xs font-semibold whitespace-nowrap uppercase"
						>
							Debut Date :
							{{
								artist.debut_date
									? new Date(artist.debut_date).toLocaleDateString('en-US', {
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
							:key="style"
							class="bg-cb-quaternary-950 w-fit rounded px-3 py-1 text-xs font-semibold whitespace-nowrap uppercase"
						>
							{{ style }}
						</p>
						<p
							v-for="tag in artist.general_tags"
							:key="tag"
							class="bg-cb-quaternary-950 w-fit rounded px-3 py-1 text-xs font-semibold whitespace-nowrap uppercase"
						>
							{{ tag }}
						</p>
					</div>
					<div v-if="!isFetchingArtist && isAdminStore" class="flex flex-wrap gap-2">
						<NuxtLink
							:to="editLink"
							class="bg-cb-secondary-950 px-2 py-1 text-xs font-semibold uppercase"
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

			<div v-else class="space-y-5">
				<CardDefault
					v-if="platformLinksList?.length && !isFetchingArtist"
					name="Streaming Platforms"
				>
					<div class="flex flex-wrap gap-2">
						<ComebackExternalLink
							v-for="platform in platformLinksList"
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
					v-if="socialLinksList?.length && !isFetchingArtist"
					name="Socials Media"
				>
					<div class="flex flex-wrap gap-2">
						<LazyComebackExternalLink
							v-for="social in socialLinksList"
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

				<CardDefault
					v-if="artist.id_youtube_music && musicDiscover.length > 0"
					name="Discover Music"
				>
					<transition-group
						v-if="musicDiscover.length > 0"
						name="list-complete"
						tag="div"
						class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
					>
						<MusicDisplay
							v-for="song in musicDiscover"
							:key="song.id_youtube_music"
							:artist-id="''"
							:artist-name="artist.name"
							:music-id="song.id_youtube_music"
							:music-name="song.name"
							:music-image="song?.thumbnails[0]?.url"
							:duration="song?.duration?.toString() || '0'"
							class="bg-cb-quinary-900 w-full"
						/>
					</transition-group>
				</CardDefault>

				<CardDefault name="Description" class="pt-5">
					<p
						v-if="artist.description"
						class="max-w-6xl text-xs leading-6 whitespace-pre-line md:text-base md:leading-8"
					>
						{{ artist.description }}
					</p>
					<div v-else>
						<p class="text-xs md:text-base">No description.</p>
						<p class="text-xs md:text-base">
							Write a description to share more information about this artist with our
							community.
						</p>
						<div v-if="isAdminStore" class="pt-2">
							<NuxtLink
								:to="editLink"
								class="bg-cb-quaternary-950 mt-5 px-2 py-1 text-xs font-semibold uppercase"
							>
								Add a description
							</NuxtLink>
						</div>
					</div>
				</CardDefault>
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

			<div v-if="albumEpRelease.length && !isFetchingArtist">
				<CardDefault name="Albums/Eps">
					<transition-group
						name="list-complete"
						tag="div"
						class="scrollBarLight flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 xl:flex-wrap"
					>
						<CardObject
							v-for="release in albumEpRelease"
							:key="release.id_youtube_music"
							:artist-id="artist.id"
							:main-title="release.name"
							:image="release.image"
							:release-date="release.date"
							:release-type="release.type"
							:object-link="`/release/${release.id}`"
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
							:key="release.id_youtube_music"
							:artist-id="artist.id"
							:main-title="release.name"
							:image="release.image"
							:release-date="release.date"
							:release-type="release.type"
							:object-link="`/release/${release.id}`"
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
