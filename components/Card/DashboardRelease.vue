<script setup lang="ts">
	// Déclaration du module pour vue-modal
	declare module '@kouts/vue-modal'

	import * as Mdl from '@kouts/vue-modal'
	import '@kouts/vue-modal/dist/vue-modal.css'
	import { useToast } from 'vue-toastification'
	import type { PropType } from 'vue'

	// Interface pour la structure d'une plateforme
	interface Platform {
		name: string
		link: string
	}

	const {
		id,
		artistsName,
		createdAt,
		date,
		idYoutubeMusic,
		image,
		name,
		needToBeVerified,
		platformList,
		type,
		yearReleased,
	} = defineProps({
		id: {
			type: String,
			required: true,
		},
		artistsName: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Object,
			required: true,
		},
		date: {
			type: Object,
			required: true,
		},
		idYoutubeMusic: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		needToBeVerified: {
			type: Boolean,
			required: true,
		},
		platformList: {
			type: Array as PropType<Platform[]>,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		yearReleased: {
			type: Number,
			required: true,
		},
	})

	const { Modal } = Mdl
	const { deleteRelease } = useFirebaseFunction()
	const emit = defineEmits(['deleteRelease', 'updateRelease'])

	const showModal = ref(false)
	const imageLoaded = ref(false)
	const dateToTestYear = date ? new Date(date.seconds * 1000) : new Date()

	// COMPUTED
	const releaseDate = computed(() => {
		let dateComputed = new Date()
		if (date) {
			dateComputed = new Date(date.seconds * 1000)
			return `${dateComputed.getDate()}-${dateComputed.getMonth() + 1}-${dateComputed.getFullYear()}`
		} else {
			return 'No Date'
		}
	})

	const doubleCheckYear = computed(() => {
		if (yearReleased !== dateToTestYear.getFullYear()) return true
		return false
	})

	// FONCTIONS
	const showImage = () => {
		imageLoaded.value = true
	}

	const callDeleteRelease = () => {
		deleteRelease(id)
			.then((res) => {
				if (res == 'success') {
					const toast = useToast()
					toast.success('Release deleted')
					emit('deleteRelease', id)
				} else {
					const toast = useToast()
					toast.error('Error when deleting release')
				}
			})
			.catch((err) => {
				const toast = useToast()
				toast.error('Error when deleting release', err)
			})
	}

	const showUpdateVerifiedRelease = () => {
		showModal.value = true
	}

	const onReleaseVerified = () => {
		showModal.value = false
		emit('updateRelease')
	}
</script>

<template>
	<div
		class="relative flex h-full flex-col justify-between gap-1.5 rounded bg-quaternary p-3 text-xs"
	>
		<div class="space-y-1.5">
			<div class="flex w-full justify-between text-xs">
				<div class="flex gap-1">
					<p>[{{ type }}]</p>
					<p>[{{ yearReleased }}]</p>
				</div>
				<p>
					{{ idYoutubeMusic }}
				</p>
			</div>

			<p
				v-if="needToBeVerified || doubleCheckYear"
				class="absolute z-50 rounded-full bg-red-500 px-2 text-xs font-semibold"
			>
				Need To Be Verified
			</p>

			<div class="relative aspect-square w-full rounded bg-primary">
				<NuxtImg
					v-show="imageLoaded"
					ref="skeleton"
					:src="image"
					:alt="name"
					format="webp"
					loading="lazy"
					class="w-full rounded transition-all duration-1000 ease-in-out"
					@load="showImage()"
				/>
			</div>

			<div>
				<NuxtLink
					:to="'/release/' + id"
					target="_blank"
					class="font-semibold transition-all duration-300 ease-in-out hover:text-primary"
				>
					{{ name }}
				</NuxtLink>
				<p class="border-t border-zinc-500">{{ artistsName }}</p>
			</div>

			<div class="space-y-2 pt-2">
				<p class="border-b border-zinc-500 pb-1 text-xs font-semibold uppercase">
					Platforms
				</p>
				<div v-if="platformList.length" class="flex flex-col space-y-1">
					<a
						v-for="(platform, index) in platformList"
						:key="platform.name + index"
						:href="platform.link"
						target="_blank"
						class="overflow-hidden rounded bg-quinary text-xs"
					>
						<p class="bg-secondary px-1.5 py-1 uppercase">{{ platform.name }}</p>
						<p class="truncate px-1.5 py-1">{{ platform.link }}</p>
					</a>
				</div>
				<p v-else class="rounded bg-quinary px-2 py-1 text-center text-xs uppercase">
					No Platforms Link
				</p>
			</div>
		</div>

		<div class="flex w-full items-center justify-between">
			<p class="text-xs uppercase">
				Release date :
				<span class="font-bold">{{ releaseDate }}</span>
			</p>
			<div class="space-x-1">
				<button
					class="rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500"
					@click="showUpdateVerifiedRelease"
				>
					Edit
				</button>
				<button
					class="rounded bg-quinary px-2 py-1 text-xs uppercase hover:bg-zinc-500"
					@click="callDeleteRelease"
				>
					Delete
				</button>
			</div>
		</div>

		<Modal
			v-model="showModal"
			:title="`Fix Release : ${artistsName} - ${name}`"
			wrapper-class="animate__animated modal-wrapper"
			:modal-class="`modal modal-xl`"
			:modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
			:in-class="`animate__fadeInDown`"
			:out-class="`animate__bounceOut`"
			bg-class="animate__animated"
			:bg-in-class="`animate__fadeInUp`"
			:bg-out-class="`animate__fadeOutDown`"
		>
			<ModalEditRelease
				:id="id"
				:name="name"
				:type="type"
				:id-youtube-music="idYoutubeMusic"
				:date="date"
				:year-released="yearReleased"
				:need-to-be-verified="needToBeVerified"
				:artists-name="artistsName"
				:platform-list="platformList"
				@verified-release="onReleaseVerified"
			/>
		</Modal>
	</div>
</template>

<style>
	.modal {
		min-width: 300px !important;
	}
	.modal-xl {
		width: 80% !important;
		max-width: 1140px !important;
	}
</style>
