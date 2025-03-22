<script setup lang="ts">
	import { useToast } from 'vue-toastification'
	import type { Artist } from '~/types/artist'
	import { useFirebaseArtist } from '~/composables/Firebase/useFirebaseArtist'
	import { useFirebaseArtistPending } from '~/composables/Firebase/useFirebaseArtistPending'

	const { updateArtist } = useFirebaseArtist()
	const { getAllPendingArtists, deletePendingArtist } = useFirebaseArtistPending()
	const toast = useToast()

	const artistUpdateList = ref<Artist[]>([])

	onMounted(async () => {
		artistUpdateList.value = await getAllPendingArtists()
		console.log(artistUpdateList.value)
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
		class="scrollBarLight relative h-full space-y-3 overflow-hidden overflow-y-scroll pr-2"
	>
		<div v-if="artistUpdateList.length" class="mb-4 flex justify-end">
			<button
				class="rounded bg-red-700 px-4 py-2 font-semibold uppercase text-white transition-all duration-300 ease-in-out hover:bg-red-500"
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
				class="list-complete-item flex h-full flex-col space-y-2 rounded bg-quaternary p-2"
			>
				<CardDashboardArtistUpdate :artist-pending="artist" />
				<div class="grid grid-cols-2 gap-2">
					<button
						class="rounded bg-green-700 py-3 font-semibold uppercase transition-all duration-300 ease-in-out hover:bg-green-500"
						@click="confirmEdition(artist.taskId, artist, index)"
					>
						Confirm
					</button>
					<button
						class="rounded bg-red-700 py-3 font-semibold uppercase transition-all duration-300 ease-in-out hover:bg-red-500"
						@click="deleteEdition(artist.taskId, index)"
					>
						Reject
					</button>
				</div>
			</div>
		</transition-group>
		<p
			v-else
			class="col-span-2 w-full bg-quaternary p-5 text-center font-semibold uppercase"
		>
			No pending artist updates
		</p>
	</div>
</template>
