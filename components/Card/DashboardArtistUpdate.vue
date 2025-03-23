<script setup lang="ts">
	import type { Artist } from '~/types/artist'
	import { useFirebaseArtist } from '~/composables/useFirebaseArtist'

	const { getFullArtistById } = useFirebaseArtist()

	const { artistPending } = defineProps({
		artistPending: {
			type: Object as PropType<Artist>,
			required: true,
		},
	})

	const artist = ref<Artist | null>(null)

	onMounted(async () => {
		artist.value = await getFullArtistById(artistPending.id)
	})
</script>

<template>
	<div class="list-complete-item space-y-2 rounded bg-quaternary p-3">
		<div v-if="artistPending.image" class="relative">
			<NuxtImg
				:src="artistPending.image"
				alt="image changed"
				format="webp"
				loading="lazy"
				class="w-full rounded bg-zinc-500"
			/>
		</div>
		<!-- General Info -->
		<div class="space-y-2 text-sm">
			<p v-if="artistPending.name">
				<span class="font-semibold uppercase">Name :</span>
				{{ artistPending.name }}
			</p>
			<p v-if="artistPending.type">
				<span class="font-semibold uppercase">Type :</span>
				{{ artistPending.type }}
			</p>
			<p v-if="artistPending.idYoutubeMusic">
				<span class="font-semibold uppercase">Id Youtube Music :</span>
				{{ artistPending.idYoutubeMusic }}
			</p>
			<p v-if="artistPending.description">
				<span class="font-semibold uppercase">Description :</span>
				{{ artistPending.description }}
			</p>
		</div>
		<!-- Styles -->
		<div v-if="artistPending.styles" class="space-y-2">
			<p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Styles</p>
			<div v-if="artistPending.styles.length" class="flex gap-1">
				<p
					v-for="style in artistPending.styles"
					:key="style.name"
					class="rounded bg-quinary px-2 py-1 text-xs uppercase"
				>
					{{ style.name }}
				</p>
			</div>
			<p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">
				No Styles
			</p>
		</div>
		<!-- Socials -->
		<div v-if="artistPending.socialList" class="space-y-2">
			<p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Socials</p>
			<div v-if="artistPending.socialList.length" class="flex flex-col space-y-1">
				<a
					v-for="social in artistPending.socialList"
					:key="social.name"
					:href="social.link"
					target="_blank"
					class="truncate rounded bg-quinary px-2 py-1 text-xs"
				>
					{{ social.link }}
				</a>
			</div>
			<p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">
				No Socials Link
			</p>
		</div>
		<!-- Platforms -->
		<div v-if="artistPending.platformList" class="space-y-2">
			<p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">
				Platforms
			</p>
			<div v-if="artistPending.platformList.length" class="flex flex-col space-y-1">
				<a
					v-for="platform in artistPending.platformList"
					:key="platform.name"
					:href="platform.link"
					target="_blank"
					class="truncate rounded bg-quinary px-2 py-1 text-xs"
				>
					{{ platform.link }}
				</a>
			</div>
			<p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">
				No Platforms Link
			</p>
		</div>
		<!-- Members -->
		<div v-if="artistPending.members" class="space-y-2">
			<p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Members</p>
			<div v-if="artistPending.members.length" class="flex flex-wrap gap-1">
				<p
					v-for="member in artistPending.members"
					:key="member.id"
					class="truncate rounded bg-quinary px-2 py-1 text-xs"
				>
					{{ member.name }}
				</p>
			</div>
			<p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">
				No Members
			</p>
		</div>
		<!-- Groups -->
		<div v-if="artistPending.groups" class="space-y-2">
			<p class="border-b border-zinc-500 pb-1 text-sm font-semibold uppercase">Groups</p>
			<div v-if="artistPending.groups.length" class="flex flex-wrap gap-1">
				<p
					v-for="group in artistPending.groups"
					:key="group.id"
					class="truncate rounded bg-quinary px-2 py-1 text-xs"
				>
					{{ group.name }}
				</p>
			</div>
			<p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">
				No Groups
			</p>
		</div>
	</div>
</template>
