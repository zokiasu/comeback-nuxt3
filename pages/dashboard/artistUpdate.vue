<script setup>
	import { useToast } from 'vue-toastification'
	const { updateArtist } = useFirebaseFunction()
	const toast = useToast()

	const artistUpdateList = ref([])

	onMounted(async () => {
		artistUpdateList.value = await queryByCollection('updateArtistPending')
	})

	const deleteEdition = async (id, index) => {
		await deletebyDoc('updateArtistPending', id)
		artistUpdateList.value.splice(index, 1)
		toast.success('Artist Pending Deleted', {
			position: 'top-right',
			timeout: 5000,
			closeOnClick: true,
			pauseOnFocusLoss: false,
			pauseOnHover: true,
			draggable: true,
			draggablePercent: 0.6,
			showCloseButtonOnHover: false,
			hideProgressBar: false,
			closeButton: 'button',
			icon: true,
			rtl: false,
			transition: 'Vue-Toastification__bounce',
			maxToasts: 5,
			newestOnTop: true,
		})
	}

	const confirmEdition = async (id, artist, index) => {
		updateArtist(artist).then(async () => {
			await deletebyDoc('updateArtistPending', id)
			artistUpdateList.value.splice(index, 1)
			toast.success('Artist Updated')
		})
	}
</script>

<template>
	<div>
		<transition-group
			v-if="artistUpdateList.length"
			name="list-complete"
			tag="div"
			class="grid grid-cols-1 items-center justify-center gap-4 transition-all duration-300 ease-in-out"
		>
			<div
				v-for="(artist, index) in artistUpdateList"
				:key="artist.id"
				class="list-complete-item h-full w-full space-y-2 bg-zinc-500 p-2"
			>
				<CardDashboardArtistUpdate
					:id="artist.id"
					:task-id="artist.taskId"
					:name="artist.name"
					:image="artist.image"
					:description="artist.description"
					:type="artist.type"
					:id-youtube-music="artist.idYoutubeMusic"
					:styles="artist.styles"
					:socials="artist.socials"
					:platforms="artist.platforms"
					:groups="artist.groups"
					:members="artist.members"
				/>
				<div class="grid grid-cols-2 gap-2">
					<button
						class="rounded bg-green-700 font-semibold uppercase transition-all duration-300 ease-in-out hover:bg-green-500"
						@click="confirmEdition(artist.taskId, artist, index)"
					>
						Confirm
					</button>
					<button
						class="rounded bg-red-700 font-semibold uppercase transition-all duration-300 ease-in-out hover:bg-red-500"
						@click="deleteEdition(artist.taskId, index)"
					>
						Reject
					</button>
				</div>
			</div>
		</transition-group>
		<p v-else class="w-full bg-quaternary p-5 text-center font-semibold uppercase">
			No pending artist updates
		</p>
	</div>
</template>
