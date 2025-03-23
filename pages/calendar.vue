<script setup>
	import { Timestamp } from 'firebase/firestore'
	import { useFirebaseFunction } from '~/composables/useFirebaseFunction'

	const releases = ref([])
	const backTop = ref(null)
	const yearList = ref([])
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
	const currentYear = ref(new Date().getFullYear())
	const currentMonth = ref(new Date().getMonth())
	const startDate = ref(new Date(currentYear.value, currentMonth.value, 1))
	const endDate = ref(new Date(currentYear.value, currentMonth.value + 1, 0))
	const { getReleasesBetweenDates } = useFirebaseFunction()
	const onlyAlbums = ref(false)
	const onlyEps = ref(false)
	const onlySingles = ref(false)

	function handleScrollCalendar() {
		if (backTop.value) {
			if (window.scrollY > 50) {
				backTop.value.classList.remove('hidden')
			} else {
				backTop.value.classList.add('hidden')
			}
		}
	}

	const switchTypeFilter = async (type) => {
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
		document.getElementById('__nuxt').scrollIntoView({ behavior: 'smooth' })
	}

	onMounted(async () => {
		for (let year = 2020; year <= currentYear.value; year++) {
			yearList.value.push(year)
		}

		releases.value = await getReleasesBetweenDates(
			Timestamp.fromDate(startDate.value),
			Timestamp.fromDate(endDate.value),
		)

		window.addEventListener('scroll', handleScrollCalendar)
	})

	watch([currentYear, currentMonth], async () => {
		startDate.value = new Date(currentYear.value, currentMonth.value, 1)
		endDate.value = new Date(currentYear.value, currentMonth.value + 1, 0)
		releases.value = await getReleasesBetweenDates(
			Timestamp.fromDate(startDate.value),
			Timestamp.fromDate(endDate.value),
		)
	})

	useHead({
		title: 'Releases Calendar',
		meta: [
			{
				name: 'description',
				content: 'Releases Calendar',
			},
		],
	})
</script>

<template>
	<div
		id="calendarPage"
		class="container mx-auto h-fit min-h-screen w-full space-y-3 p-3 md:p-5"
	>
		<!-- Period Selector -->
		<div>
			<!-- Year Selector -->
			<div
				class="remove-scrollbar scrollBarLight flex w-full snap-x snap-mandatory gap-1 overflow-x-auto pb-1 text-xs font-semibold"
			>
				<button
					v-for="year in yearList"
					:id="year"
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
				class="remove-scrollbar scrollBarLight flex w-full snap-x snap-mandatory gap-1 overflow-x-auto pb-1 text-xs font-semibold"
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
		<div class="space-y-2 border-y-2 border-quaternary py-3 text-xs">
			<!-- <p class="font-semibold text-base text-center">
        {{ monthList[currentMonth].original }} {{ currentYear }}'s stats
      </p> -->
			<div class="grid grid-cols-4 items-center justify-center gap-1 lg:gap-5">
				<button
					class="flex h-full w-full flex-col items-center justify-center rounded bg-primary px-2 py-1"
					:class="
						!onlyAlbums && !onlyEps && !onlySingles ? 'bg-primary' : 'bg-quaternary'
					"
					@click="switchTypeFilter('ALL')"
				>
					Total releases
					<span class="text-base font-bold">{{ releases.length }}</span>
				</button>
				<button
					class="flex h-full w-full flex-col items-center justify-center rounded bg-primary px-2 py-1"
					:class="onlyAlbums && !onlyEps && !onlySingles ? 'bg-primary' : 'bg-quaternary'"
					@click="switchTypeFilter('ALBUM')"
				>
					Total albums
					<span class="text-base font-bold">
						{{ releases.filter((release) => release.type === 'ALBUM').length }}
					</span>
				</button>
				<button
					class="flex h-full w-full flex-col items-center justify-center rounded bg-primary px-2 py-1"
					:class="!onlyAlbums && onlyEps && !onlySingles ? 'bg-primary' : 'bg-quaternary'"
					@click="switchTypeFilter('EP')"
				>
					Total EPs
					<span class="text-base font-bold">
						{{ releases.filter((release) => release.type === 'EP').length }}
					</span>
				</button>
				<button
					class="flex h-full w-full flex-col items-center justify-center rounded bg-primary px-2 py-1"
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
		<!-- <p class="text-primary text-sm italic">Some troubles have been noticed with our release recovery API and are working to resolve them quickly. We apologize for the inconvenience.</p> -->
		<!-- Releases -->
		<transition-group
			tag="div"
			leave-active-class="animate__bounceOut"
			enter-active-class="animate__bounceIn"
			class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3.5 lg:grid-cols-6 xl:grid-cols-8"
		>
			<CardObject
				v-for="release in releasesDisplayed"
				:key="release.idYoutubeMusic"
				:artist-id="release.artistsId"
				:main-title="release.name"
				:sub-title="release.artistsName"
				:image="release.image"
				:release-date="release.date"
				:release-type="release.type"
				:object-link="`/release/${release.idYoutubeMusic}`"
				date-always-display
				class="!min-w-full"
			/>
		</transition-group>
		<!-- Back to top -->
		<div
			ref="backTop"
			class="sticky bottom-12 hidden w-full py-5 text-center lg:bottom-0"
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
