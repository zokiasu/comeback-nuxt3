<template>
	<div
		v-if="profileData"
		class="min-h-dvh-wo-nav max-h-dvh-wo-nav space-y-5 p-3 xl:container xl:mx-auto xl:p-5"
	>
		<div
			class="relative grid grid-cols-1 gap-5 rounded bg-quaternary p-3 lg:grid-cols-2 xl:p-5"
		>
			<NuxtImg
				:src="profileData.picture || 'https://i.ibb.co/wLhbFZx/Frame-255.png'"
				:alt="profileData.name"
				format="webp"
				loading="lazy"
				class="w-full rounded object-cover"
			/>
			<div>
				<h1 class="text-2xl font-semibold">{{ profileData.name }}</h1>
				<p class="text-sm italic">{{ profileData.role }}</p>
			</div>
			<NuxtLink
				v-if="route.params.id === userDataStore.id"
				to="/settings/profile"
				class="absolute right-5 top-5 rounded bg-secondary px-2 py-1 text-xs font-semibold uppercase"
			>
				Edit Profile
			</NuxtLink>
			<p class="text-sm lg:absolute lg:bottom-5 lg:right-5">
				Registered at : {{ createdAt }}
			</p>
		</div>
		<div class="space-y-5 rounded bg-quaternary p-3 xl:p-5">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold">Rankings</h2>
				<NuxtLink
					to="/ranking/create"
					class="rounded bg-secondary px-2 py-1 text-xs font-semibold uppercase"
				>
					Create a Ranking
				</NuxtLink>
			</div>
			<div
				v-if="rankings"
				class="remove-scrollbar relative flex gap-2 overflow-x-auto xl:gap-5"
			>
				<CardProfileRanking
					v-for="ranking in rankings"
					:key="ranking.id"
					:ranking="ranking"
					:is-profile="isProfile"
					@delete="deleteRanking(ranking.id)"
				/>
			</div>
		</div>
	</div>
	<div
		v-else
		class="min-h-dvh-wo-nav max-h-dvh-wo-nav flex items-center justify-center space-y-5 p-5"
	>
		<p class="text-center font-semibold text-tertiary/50">Loading data...</p>
	</div>
</template>

<script setup>
	import { Timestamp } from 'firebase/firestore'
	import { useUserStore } from '@/stores/user'
	import { useFirebaseRealtimeDatabase } from '~/composables/useFirebaseRealtimeDatabase'

	const route = useRoute()
	const { userDataStore } = useUserStore()
	const { readData, deleteData } = useFirebaseRealtimeDatabase()
	const { getUserData } = useFirebaseFunction()

	const createdAt = ref(null)
	const rankings = ref(null)
	const profileData = ref(null)

	const isProfile = computed(() => {
		return route.params.id === profileData.value.id
	})

	const deleteRanking = async (id) => {
		await deleteData(`/rankings/${userDataStore.id}/${id}`)
		rankings.value = rankings.value.filter((ranking) => ranking.id !== id)
	}

	onMounted(async () => {
		profileData.value = await getUserData(route.params.id)
		const timestamp = new Timestamp(
			profileData.value.createdAt.seconds,
			profileData.value.createdAt.nanoseconds,
		)
		createdAt.value = new Date(timestamp.toDate()).toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
		rankings.value = await readData(`/rankings/${profileData.value.id}`)
		if (rankings.value) {
			rankings.value = Object.keys(rankings.value).map((key) => ({
				id: key,
				...rankings.value[key],
			}))
		}
	})
</script>
