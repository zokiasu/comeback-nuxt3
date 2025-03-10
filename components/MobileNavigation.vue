<script setup lang="ts">
	import * as Mdl from '@kouts/vue-modal'
	import type { PropType } from 'vue'
	import type { Artist } from '~/types/artist'

	const { Modal } = Mdl
	const showModal = ref(false)
	const showModalAlgolia = ref(false)
	const isPlayingVideo = useIsPlayingVideo()

	const props = defineProps({
		artistFetch: {
			type: Array as PropType<Artist[]>,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
		},
		isLogin: {
			type: Boolean,
			required: true,
		},
	})

	const userStore = useUserStore()
	const userDataStore = computed(() => userStore.userDataStore)

	const profilePath = computed(() => {
		if (!userDataStore.value || !userDataStore.value.id) {
			return '/settings/profile'
		}
		return `/profile/${userDataStore.value.id}`
	})
</script>

<template>
	<div
		class="fixed w-full px-5 transition-all duration-300 ease-in-out"
		:class="isPlayingVideo ? 'bottom-20' : 'bottom-5'"
	>
		<div
			class="flex w-full justify-between divide-x divide-zinc-700 overflow-hidden rounded-full border border-zinc-700 bg-secondary shadow shadow-zinc-700 drop-shadow-sm"
		>
			<NuxtLink
				:to="`/`"
				class="flex w-full items-center justify-center py-2 transition-all duration-500 ease-in-out hover:bg-zinc-500/50"
			>
				<IconHome class="mx-auto h-5 w-5" />
			</NuxtLink>
			<NuxtLink
				:to="`/calendar`"
				class="flex w-full items-center justify-center py-2 transition-all duration-500 ease-in-out hover:bg-zinc-500/50"
			>
				<IconCalendar class="mx-auto h-5 w-5" />
			</NuxtLink>
			<button
				class="flex w-full items-center justify-center py-2 transition-all duration-500 ease-in-out hover:bg-zinc-500/50"
				@click="showModalAlgolia = true"
			>
				<IconSearch class="mx-auto h-5 w-5" />
			</button>
			<NuxtLink
				v-if="props.isLogin && userDataStore"
				:to="profilePath"
				class="flex w-full items-center justify-center py-2 transition-all duration-500 ease-in-out hover:bg-zinc-500/50"
			>
				<IconArtist class="mx-auto h-5 w-5" />
			</NuxtLink>
			<NuxtLink
				v-if="props.isAdmin"
				:to="`/dashboard/artist`"
				class="flex w-full items-center justify-center py-2 transition-all duration-500 ease-in-out hover:bg-zinc-500/50"
			>
				<IconEdit class="mx-auto h-5 w-5" />
			</NuxtLink>
			<NuxtLink
				v-if="!props.isLogin"
				:to="`/authentification`"
				class="flex w-full items-center justify-center py-2 transition-all duration-500 ease-in-out hover:bg-zinc-500/50"
			>
				<IconAccount class="mx-auto h-5 w-5" />
			</NuxtLink>
			<button
				v-else
				class="flex w-full items-center justify-center bg-primary/20 py-2 transition-all duration-500 ease-in-out"
				@click="showModal = true"
			>
				<IconComeback class="mx-auto h-5 w-5" />
			</button>
		</div>
		<Modal
			v-model="showModal"
			title="Add a News"
			wrapper-class="animate__animated modal-wrapper"
			:modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
			:in-class="`animate__fadeInDown`"
			:out-class="`animate__bounceOut`"
			bg-class="animate__animated"
			:bg-in-class="`animate__fadeInUp`"
			:bg-out-class="`animate__fadeOutDown`"
		>
			<ModalNewsCreation
				:artist-list="props.artistFetch"
				@close-modal="showModal = false"
			/>
		</Modal>
		<Modal
			v-model="showModalAlgolia"
			title="Search Artist"
			wrapper-class="modal-wrapper"
			:modal-class="`modal-lg`"
			:modal-style="{ background: '#1F1D1D', 'border-radius': '0.25rem', color: 'white' }"
			:in-class="`animate__bounceIn`"
			:out-class="`animate__bounceOut`"
			bg-class="animate__animated"
			:bg-in-class="`animate__fadeInUp`"
			:bg-out-class="`animate__fadeOutDown`"
		>
			<Algolia ref="algolia" @close-modal="showModalAlgolia = false" />
		</Modal>
	</div>
</template>
