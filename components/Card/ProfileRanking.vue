<template>
	<div class="min-w-[300px] flex-1 rounded bg-quinary text-left">
		<div class="relative rounded-t bg-secondary px-2 py-1 text-center font-bold">
			<p class="cursor-pointer" @click="showModal = true">
				{{ ranking.name || 'Untitled' }}
			</p>
			<div v-if="isProfile" class="absolute right-2 top-2 flex gap-2">
				<NuxtLink :to="`/ranking/edit/${ranking.id}`">
					<IconEdit class="h-4 w-4 hover:text-primary" />
				</NuxtLink>
				<IconDelete
					class="h-4 w-4 cursor-pointer hover:text-primary"
					@click="deleteRanking"
				/>
			</div>
		</div>
		<div
			v-for="(music, index) in ranking.musics.slice(0, 3)"
			:key="music.videoId"
			class="cursor-pointer space-y-2 p-2"
			@click="showModal = true"
		>
			<p class="group relative truncate">
				<span>#{{ index + 1 }} - {{ music.artists[0].name }} - {{ music.name }}</span>
			</p>
		</div>
		<p
			v-if="ranking.musics.length > 3"
			class="p-2 pt-0 text-start text-xs italic text-tertiary/50"
		>
			And {{ ranking.musics.length - 3 }} more songs, click to see the full ranking
		</p>
	</div>
	<Modal
		v-model="showModal"
		:title="ranking.name || 'Untitled'"
		wrapper-class="animate__animated modal-wrapper"
		:modal-class="`modal modal-xl`"
		:modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
		:in-class="`animate__fadeInDown`"
		:out-class="`animate__bounceOut`"
		bg-class="animate__animated"
		:bg-in-class="`animate__fadeInUp`"
		:bg-out-class="`animate__fadeOutDown`"
	>
		<div
			class="grid grid-rows-10 gap-2"
			:class="
				ranking.musics.length > 10
					? 'remove-scrollbar grid-flow-col overflow-x-auto pb-2'
					: ''
			"
		>
			<div
				v-for="(song, index) in ranking.musics"
				:key="song.videoId"
				class="flex min-w-80 items-center gap-2 xl:min-w-96"
			>
				<p
					class="flex aspect-square h-full items-center justify-center rounded bg-quinary"
				>
					#{{ index + 1 }}
				</p>
				<MusicDisplay
					:artist-id="song.artists[0].artistId"
					:artist-name="song.artists[0].name"
					:music-id="song.videoId"
					:music-name="song.name"
					:music-image="song.thumbnails[2].url"
					:duration="song?.duration?.toString() || '0'"
					class="w-full bg-quinary"
				/>
			</div>
		</div>
	</Modal>
</template>

<script setup lang="ts">
	import * as Mdl from '@kouts/vue-modal'
	import '@kouts/vue-modal/dist/vue-modal.css'

	defineProps<{
		ranking: any
		isProfile: boolean
	}>()

	const { Modal } = Mdl
	const showModal = ref(false)

	const emit = defineEmits(['delete'])

	const deleteRanking = () => {
		emit('delete')
	}
</script>

<style>
	.modal {
		min-width: 300px;
	}
	@media (min-width: 480px) {
		.modal.modal-sm {
			max-width: 300px;
		}
	}
	@media (min-width: 992px) {
		.modal.modal-lg,
		.modal.modal-xl {
			max-width: 800px;
		}
	}
	@media (min-width: 1200px) {
		.modal.modal-xl {
			max-width: 1140px;
		}
	}
</style>
