<script setup lang="ts">
	import { useToast } from 'vue-toastification'
	import { useFirebaseFunction } from '~/composables/Firebase/useFirebaseFunction'
	import { useFirebaseArtist } from '~/composables/Firebase/useFirebaseArtist'
	import { useUserStore } from '~/stores/user'
	import type { User } from '~/types/user'
	import type { Artist } from '~/types/artist'

	const userStore = useUserStore()
	const toast = useToast()
	const { getAllArtists } = useFirebaseArtist()
	const { updateUserData, getUserData } = useFirebaseFunction()

	const userDetails = ref<User>({} as User)
	const artistList = ref<Artist[]>([])
	const searchInput = ref('')

	const artistFiltered = computed(() => {
		return artistList.value.filter((artist) =>
			artist.name.toLowerCase().includes(searchInput.value.toLowerCase()),
		)
	})

	const updateUserDetails = async () => {
		await updateUserData(userDetails.value)
		userDetails.value = (await getUserData(userDetails.value.id)) as User
		toast.success('User details updated')
	}

	onMounted(async () => {
		artistList.value = await getAllArtists()
		if (userStore.userDataStore?.id) {
			userDetails.value = (await getUserData(userStore.userDataStore.id)) as User
		}
	})
</script>

<template>
	<div
		class="min-h-dvh-wo-nav max-h-dvh-wo-nav flex h-screen flex-col gap-5 rounded px-5"
	>
		<div class="flex w-full justify-between">
			<p class="text-2xl font-bold">Profile Settings</p>
			<button
				class="rounded bg-primary px-5 py-1 hover:bg-primary/90"
				@click="updateUserDetails"
			>
				Save
			</button>
		</div>
		<div v-if="userDetails" class="grid grid-cols-1 gap-5 lg:grid-cols-2">
			<div class="space-y-5">
				<div class="space-y-1">
					<p class="font-semibold uppercase">ID</p>
					<p class="opacity-50">{{ userDetails.id }}</p>
				</div>
				<div class="space-y-1">
					<p class="font-semibold uppercase">Role</p>
					<p class="opacity-50">{{ userDetails.role }}</p>
				</div>
				<div class="space-y-1">
					<p class="font-semibold uppercase">Username</p>
					<!-- <p>{{ userDetails.name }}</p> -->
					<input
						id="userName"
						v-model="userDetails.name"
						type="text"
						placeholder="Search Artist..."
						class="w-full rounded border-none bg-quinary px-3 py-1 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none lg:max-w-lg"
					/>
				</div>
				<div class="space-y-1">
					<p class="font-semibold uppercase">Email</p>
					<!-- <p>{{ userDetails.email }}</p> -->
					<input
						id="email"
						v-model="userDetails.email"
						type="text"
						placeholder="Search Artist..."
						class="w-full rounded border-none bg-quinary px-3 py-1 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none lg:max-w-lg"
					/>
				</div>
				<div class="space-y-1">
					<p class="font-semibold uppercase">Created Date</p>
					<p class="opacity-50">
						{{
							new Date(userDetails.createdAt.toDate()).toLocaleDateString('fr-FR', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
							})
						}}
					</p>
				</div>
				<div class="space-y-1">
					<p class="font-semibold uppercase">Last Update</p>
					<p class="opacity-50">
						{{
							new Date(userDetails.updatedAt.toDate()).toLocaleDateString('fr-FR', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
							})
						}}
					</p>
				</div>
			</div>

			<div class="space-y-1">
				<p class="font-semibold uppercase">Picture</p>
				<div class="flex flex-col gap-5">
					<NuxtImg
						:src="userDetails.picture"
						:alt="userDetails.name"
						class="aspect-video h-80 rounded object-cover"
					/>
					<div class="space-y-2 text-sm">
						<input
							id="search-input"
							v-model="searchInput"
							type="text"
							placeholder="Search Artist..."
							class="w-full rounded border-none bg-quinary px-3 py-1 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
						/>
						<div
							class="scrollBarLight grid max-h-[20dvh] w-full grid-cols-3 justify-between gap-2 overflow-hidden overflow-y-auto pr-2 xl:max-h-[50dvh] xl:grid-cols-5"
						>
							<button
								v-for="artist in artistFiltered"
								:key="artist.id"
								class="group h-fit space-y-1 rounded bg-quinary p-1 text-center"
								@click="userDetails.picture = artist.image"
							>
								<div class="relative">
									<NuxtImg
										:src="artist.image"
										:alt="artist.name"
										quality="20"
										loading="lazy"
										class="aspect-video w-full rounded object-cover"
									/>
									<div
										class="absolute inset-0 hidden items-center justify-center bg-quinary/90 group-hover:flex"
									>
										<IconPlus class="h-5 w-5 text-tertiary" />
									</div>
								</div>
								<p class="truncate">{{ artist.name }}</p>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
