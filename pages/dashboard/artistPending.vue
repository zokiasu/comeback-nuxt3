<script setup lang="ts">
	import { useToast } from 'vue-toastification'
	import type { Artist } from '~/types/artist'
	import { useFirebaseArtist } from '~/composables/useFirebaseArtist'
	import { useFirebaseArtistPending } from '~/composables/useFirebaseArtistPending'

	const { updateArtist } = useFirebaseArtist()
	const { getAllPendingArtists, deletePendingArtist } = useFirebaseArtistPending()
	const toast = useToast()

	const artistUpdateList = ref<Artist[]>([])

	onMounted(async () => {
		artistUpdateList.value = await getAllPendingArtists()
	})

	const deleteEdition = async (id: string, index: number) => {
		await deletePendingArtist(id)
		artistUpdateList.value.splice(index, 1)
		toast.success('Artist Pending Deleted')
	}

	const confirmEdition = async (id: string, artist: Artist, index: number) => {
		updateArtist(artist).then(async () => {
			await deletePendingArtist(id)
			artistUpdateList.value.splice(index, 1)
			toast.success('Artist Updated')
		})
	}

	const rejectAll = async () => {
		if (artistUpdateList.value.length === 0) return

		try {
			await Promise.all(
				artistUpdateList.value.map(async (artist) => {
					await deletePendingArtist(artist.id)
				}),
			)
			toast.success('All pending artists rejected')
		} catch (error) {
			toast.error('Error rejecting all artists')
		}
	}
</script>

<template>
	<div
		class="relative h-full pr-2 space-y-3 overflow-hidden overflow-y-scroll scrollBarLight"
	>
		<div v-if="artistUpdateList.length" class="flex justify-end mb-4">
			<button
				class="px-4 py-2 font-semibold text-white uppercase transition-all duration-300 ease-in-out bg-red-700 rounded hover:bg-red-500"
				@click="rejectAll"
			>
				Reject All
			</button>
		</div>
		<transition-group
			v-if="artistUpdateList.length"
			name="list-complete"
			tag="div"
			class="grid grid-cols-2 gap-5"
		>
			<div
				v-for="(artist, index) in artistUpdateList"
				:key="artist.id"
				class="flex flex-col h-full p-2 space-y-2 rounded list-complete-item bg-quaternary"
			>
				<CardDashboardArtistUpdate :artist-pending="artist" />
				<div class="grid grid-cols-2 gap-2">
					<button
						class="py-3 font-semibold uppercase transition-all duration-300 ease-in-out bg-green-700 rounded hover:bg-green-500"
						@click="confirmEdition(artist.taskId, artist, index)"
					>
						Confirm
					</button>
					<button
						class="py-3 font-semibold uppercase transition-all duration-300 ease-in-out bg-red-700 rounded hover:bg-red-500"
						@click="deleteEdition(artist.taskId, index)"
					>
						Reject
					</button>
				</div>
			</div>
		</transition-group>
		<p
			v-else
			class="w-full col-span-2 p-5 font-semibold text-center uppercase bg-quaternary"
		>
			No pending artist updates
		</p>
	</div>
</template>
