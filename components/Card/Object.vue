<script setup lang="ts">
	const {
		isArtist = false,
		artistId = '',
		mainTitle,
		subTitle = '',
		image,
		objectLink,
		releaseDate = '',
		releaseType = '',
		isReleaseDisplay = false,
		dateAlwaysDisplay = false,
	} = defineProps<{
		isArtist?: boolean
		artistId?: string
		mainTitle: string
		subTitle?: string
		image: string
		objectLink: string
		releaseDate?: string
		releaseType?: string
		isReleaseDisplay?: boolean
		dateAlwaysDisplay?: boolean
	}>()

	const imageLoaded = ref(false)

	const formatDate = (date: string) => {
		const options: Intl.DateTimeFormatOptions = {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}
		return new Date(date).toLocaleDateString('fr-FR', options)
	}
</script>

<template>
	<NuxtLink
		:to="objectLink"
		class="group bg-quaternary-950 shadow-secondary-950 max-w-[10rem] min-w-[10rem] space-y-3 rounded p-4 shadow-xl transition-all duration-500 ease-in-out"
	>
		<div class="relative">
			<div
				:class="`bg-primary-900 absolute inset-0 aspect-square w-full object-cover transition-all duration-500 ease-in-out ${
					isArtist ? 'rounded-full' : 'rounded'
				} ${imageLoaded ? 'opacity-0' : 'opacity-100'}`"
			></div>
			<NuxtImg
				:src="image"
				class="shadow-secondary-950 aspect-square w-full object-cover shadow-xl"
				:class="isArtist ? 'rounded-full' : 'rounded'"
				@load="imageLoaded = true"
			/>
			<div
				v-if="!isArtist && releaseDate"
				class="bg-quaternary-950 absolute top-1 left-1 rounded px-1.5 text-xs uppercase"
				:class="dateAlwaysDisplay ? '' : 'opacity-0 group-hover:opacity-100'"
			>
				<p>
					{{ formatDate(releaseDate) }}
				</p>
			</div>
			<div
				v-if="!isArtist && releaseType"
				class="bg-quaternary-950 absolute right-1 bottom-1 rounded px-1.5 text-xs uppercase"
				:class="dateAlwaysDisplay ? '' : 'opacity-0 group-hover:opacity-100'"
			>
				<p>
					{{ releaseType }}
				</p>
			</div>
		</div>
		<div class="space-y-1.5 text-xs">
			<p class="font-semibol truncate group-hover:underline">
				{{ mainTitle }}
			</p>
			<p v-if="isArtist || isReleaseDisplay" class="truncate">{{ subTitle }}</p>
			<LazyNuxtLink v-else :to="`/artist/${artistId}`" class="hover:underline">
				<p class="truncate">{{ subTitle }}</p>
			</LazyNuxtLink>
		</div>
	</NuxtLink>
</template>
