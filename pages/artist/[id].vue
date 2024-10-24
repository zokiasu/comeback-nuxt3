<script setup lang="ts">
	import { useUserStore } from '@/stores/user'
	import { type Artist } from '@/types/artist'
	import type { Music } from '~/types/music'
	const { isLoginStore } = useUserStore()
	const { getRandomMusicFromListReleaseId, getArtistById } = useFirebaseFunction()

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
			const fetchedArtist = (await getArtistById(route.params.id as any)) as Artist
			artist.value = fetchedArtist
			imageBackground.value = fetchedArtist.image
			title.value = fetchedArtist.name
			description.value = fetchedArtist.description
		} catch (error) {
			console.error(error)
			isFetchingArtist.value = false
		} finally {
			isFetchingArtist.value = false
		}

		if (artist.value.releases.length) {
			const releaseIds = artist.value.releases
				.map((release) => release.id)
				.filter((id) => id)
			const fetchedMusicDiscover = await getRandomMusicFromListReleaseId(
				releaseIds as string[],
			)
			musicDiscover.value = fetchedMusicDiscover as Music[]
		}
	})

	const members = computed(
		() => artist.value?.members?.filter((member) => member.type === 'SOLO') || [],
	)
	const subUnitMembers = computed(
		() => artist.value?.members?.filter((member) => member.type === 'GROUP') || [],
	)
	const singleRelease = computed(
		() => artist.value?.releases?.filter((release) => release.type === 'SINGLE') || [],
	)
	const albumEpRelease = computed(
		() => artist.value?.releases?.filter((release) => release.type !== 'SINGLE') || [],
	)
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
				@load="imageBackLoaded = true"
				class="absolute inset-0 h-full w-full object-cover"
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
					<div v-if="!isFetchingArtist" class="flex gap-2">
						<p v-for="style in artist.styles" :key="style.name" class="w-fit rounded bg-quaternary px-3 py-1 text-xs font-semibold uppercase">
							{{ style.name }}
						</p>
						<p v-for="tag in artist.generalTags" :key="tag.name" class="w-fit rounded bg-quaternary px-3 py-1 text-xs font-semibold uppercase">
							{{ tag.name }}
						</p>
					</div>
					<div v-if="!isFetchingArtist" class="flex gap-2">
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
						name="Socials Media"
						v-if="artist.socialList?.length && !isFetchingArtist"
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
				<div v-if="artist.releases.length">
					<CardDefault name="Discover Music">
						<div v-if="musicDiscover.length < 1" class="space-y-2">
							<SkeletonDefault class="h-14 w-full rounded" />
							<SkeletonDefault class="h-14 w-full rounded" />
							<SkeletonDefault class="h-14 w-full rounded" />
							<SkeletonDefault class="h-14 w-full rounded" />
							<SkeletonDefault class="h-14 w-full rounded" />
						</div>
						<transition-group v-else name="list-complete" tag="div" class="space-y-2">
							<MusicDisplay
								v-for="song in musicDiscover"
								:key="song.videoId"
								:artistId="artist.id"
								:artistName="artist.name"
								:musicId="song.videoId"
								:musicName="song.name"
								:musicImage="song.thumbnails[2].url"
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
							isArtist
							:artistId="soloMember.id"
							:mainTitle="soloMember.name"
							:image="soloMember.image"
							:objectLink="`/artist/${soloMember.id}`"
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
							:key="release.id"
							:artistId="release.artistsId"
							:mainTitle="release.name"
							:image="release.image"
							:releaseDate="release.date"
							:releaseType="release.type"
							:objectLink="`/release/${release.id}`"
							isReleaseDisplay
							dateAlwaysDisplay
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
							:key="release.id"
							:artistId="release.artistsId"
							:mainTitle="release.name"
							:image="release.image"
							:releaseDate="release.date"
							:releaseType="release.type"
							:objectLink="`/release/${release.id}`"
							isReleaseDisplay
							dateAlwaysDisplay
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
							isArtist
							:artistId="groupMember.id"
							:mainTitle="groupMember.name"
							:image="groupMember.image"
							:objectLink="`/artist/${groupMember.id}`"
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
							isArtist
							:artistId="group.id"
							:mainTitle="group.name"
							:image="group.image"
							:objectLink="`/artist/${group.id}`"
						/>
					</transition-group>
				</CardDefault>
			</div>
		</section>
	</div>
</template>
