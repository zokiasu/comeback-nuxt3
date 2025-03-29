<script setup lang="ts">
	import { type Release } from '~/types/supabase/release'
	import { useSupabaseRelease } from '~/composables/Supabase/useSupabaseRelease'

	const { getReleasesByMonthAndYear } = useSupabaseRelease()

	const releases = ref<Release[]>([])
	const backTop = ref<HTMLElement | null>(null)
	const yearList = ref<number[]>([])
	const monthList = [
		{ minify: 'Jan', original: 'January' },
		{ minify: 'Feb', original: 'February' },
		{ minify: 'Mar', original: 'March' },
		{ minify: 'Apr', original: 'April' },
		{ minify: 'May', original: 'May' },
		{ minify: 'Jun', original: 'June' },
		{ minify: 'Jul', original: 'July' },
		{ minify: 'Aug', original: 'August' },
		{ minify: 'Sep', original: 'September' },
		{ minify: 'Oct', original: 'October' },
		{ minify: 'Nov', original: 'November' },
		{ minify: 'Dec', original: 'December' },
	]
	const currentYear = ref<number>(new Date().getFullYear())
	const currentMonth = ref<number>(new Date().getMonth())
	const onlyAlbums = ref<boolean>(false)
	const onlyEps = ref<boolean>(false)
	const onlySingles = ref<boolean>(false)

	function handleScrollCalendar() {
		if (backTop.value) {
			if (window.scrollY > 50) {
				backTop.value.classList.remove('hidden')
			} else {
				backTop.value.classList.add('hidden')
			}
		}
	}

	const switchTypeFilter = async (type: string) => {
		if (type === 'ALBUM') {
			onlyAlbums.value = true
			onlyEps.value = false
			onlySingles.value = false
		} else if (type === 'EP') {
			onlyAlbums.value = false
			onlyEps.value = true
			onlySingles.value = false
		} else if (type === 'SINGLE') {
			onlyAlbums.value = false
			onlyEps.value = false
			onlySingles.value = true
		} else {
			onlyAlbums.value = false
			onlyEps.value = false
			onlySingles.value = false
		}
	}

	const releasesDisplayed = computed(() => {
		if (onlyAlbums.value) {
			return releases.value.filter((release) => release.type === 'ALBUM')
		} else if (onlyEps.value) {
			return releases.value.filter((release) => release.type === 'EP')
		} else if (onlySingles.value) {
			return releases.value.filter((release) => release.type === 'SINGLE')
		} else {
			return releases.value
		}
	})

	// function backtotop to id calendarPage
	const backToTop = () => {
		const nuxtElement = document.getElementById('__nuxt')
		if (nuxtElement) {
			nuxtElement.scrollIntoView({ behavior: 'smooth' })
		}
	}

	onMounted(async () => {
		for (let year = 2020; year <= currentYear.value; year++) {
			yearList.value.push(year)
		}

		releases.value = await getReleasesByMonthAndYear(
			currentMonth.value,
			currentYear.value,
		)

		window.addEventListener('scroll', handleScrollCalendar)
	})

	watch([currentYear, currentMonth], async () => {
		releases.value = await getReleasesByMonthAndYear(
			currentMonth.value,
			currentYear.value,
		)
	})

	useHead({
		title: 'Calendar Releases',
		meta: [
			{
				name: 'description',
				content: 'Calendar Releases',
			},
		],
	})
</script>

<template>
	<div
		id="calendarPage"
		class="container w-full min-h-screen p-3 mx-auto space-y-3 h-fit md:p-5"
	>
		<!-- Period Selector -->
		<div>
			<!-- Year Selector -->
			<div
				class="flex w-full gap-1 pb-1 overflow-x-auto text-xs font-semibold remove-scrollbar scrollBarLight snap-x snap-mandatory"
			>
				<button
					v-for="year in yearList"
					:id="String(year)"
					:key="year"
					class="h-full w-full snap-start rounded px-4 py-2.5"
					:class="currentYear == year ? 'bg-primary' : 'bg-quaternary'"
					@click="((currentYear = year), switchTypeFilter('ALL'))"
				>
					{{ year }}
				</button>
			</div>
			<!-- Month Selector -->
			<div
				v-if="yearList.length"
				class="flex w-full gap-1 pb-1 overflow-x-auto text-xs font-semibold remove-scrollbar scrollBarLight snap-x snap-mandatory"
			>
				<button
					v-for="(month, index) in monthList"
					:id="month.original"
					:key="month.original"
					class="h-full w-full snap-start rounded px-4 py-2.5"
					:class="currentMonth == index ? 'bg-primary' : 'bg-quaternary'"
					@click="((currentMonth = index), switchTypeFilter('ALL'))"
				>
					<p class="block md:hidden">{{ month.minify }}</p>
					<p class="hidden md:block">{{ month.original }}</p>
				</button>
			</div>
		</div>
		<!-- Stats -->
		<div class="py-3 space-y-2 text-xs border-y-2 border-quaternary">
			<!-- <p class="text-base font-semibold text-center">
        {{ monthList[currentMonth].original }} {{ currentYear }}'s stats
      </p> -->
			<div class="grid items-center justify-center grid-cols-4 gap-1 lg:gap-5">
				<button
					class="flex flex-col items-center justify-center w-full h-full px-2 py-1 rounded bg-primary"
					:class="
						!onlyAlbums && !onlyEps && !onlySingles ? 'bg-primary' : 'bg-quaternary'
					"
					@click="switchTypeFilter('ALL')"
				>
					Total releases
					<span class="text-base font-bold">{{ releases.length }}</span>
				</button>
				<button
					class="flex flex-col items-center justify-center w-full h-full px-2 py-1 rounded bg-primary"
					:class="onlyAlbums && !onlyEps && !onlySingles ? 'bg-primary' : 'bg-quaternary'"
					@click="switchTypeFilter('ALBUM')"
				>
					Total albums
					<span class="text-base font-bold">
						{{ releases.filter((release) => release.type === 'ALBUM').length }}
					</span>
				</button>
				<button
					class="flex flex-col items-center justify-center w-full h-full px-2 py-1 rounded bg-primary"
					:class="!onlyAlbums && onlyEps && !onlySingles ? 'bg-primary' : 'bg-quaternary'"
					@click="switchTypeFilter('EP')"
				>
					Total EPs
					<span class="text-base font-bold">
						{{ releases.filter((release) => release.type === 'EP').length }}
					</span>
				</button>
				<button
					class="flex flex-col items-center justify-center w-full h-full px-2 py-1 rounded bg-primary"
					:class="!onlyAlbums && !onlyEps && onlySingles ? 'bg-primary' : 'bg-quaternary'"
					@click="switchTypeFilter('SINGLE')"
				>
					Total singles
					<span class="text-base font-bold">
						{{ releases.filter((release) => release.type === 'SINGLE').length }}
					</span>
				</button>
			</div>
		</div>
		<!-- <p class="text-sm italic text-primary">Some troubles have been noticed with our release recovery API and are working to resolve them quickly. We apologize for the inconvenience.</p> -->
		<!-- Releases -->
		<transition-group
			tag="div"
			leave-active-class="animate__bounceOut"
			enter-active-class="animate__bounceIn"
			class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3.5 lg:grid-cols-6 xl:grid-cols-8"
		>
			<CardObject
				v-for="release in releasesDisplayed"
				:key="release.id_youtube_music"
				:artist-id="release.artists?.[0]?.id"
				:main-title="release.name"
				:sub-title="release.artists?.[0]?.name"
				:image="release.image"
				:release-date="release.date"
				:release-type="release.type"
				:object-link="`/release/${release.id}`"
				date-always-display
				class="!min-w-full"
			/>
		</transition-group>
		<!-- Back to top -->
		<div
			ref="backTop"
			class="sticky hidden w-full py-5 text-center bottom-12 lg:bottom-0"
		>
			<button
				class="w-fit bg-quaternary px-4 py-2.5 text-xs font-semibold shadow shadow-zinc-700"
				@click="backToTop"
			>
				Back to top
			</button>
		</div>
	</div>
</template>
