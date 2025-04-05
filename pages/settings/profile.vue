<script setup lang="ts">
	import { useToast } from 'vue-toastification'
	import { useFirebaseFunction } from '~/composables/useFirebaseFunction'
	import { useFirebaseArtist } from '~/composables/useFirebaseArtist'
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
				class="bg-primary-900 hover:bg-primary-900/90 rounded px-5 py-1"
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
						class="bg-quinary-900 placeholder-tertiary-200 focus:bg-tertiary-200 focus:text-quinary-900 focus:placeholder-quinary-900 w-full rounded border-none px-3 py-1 drop-shadow-xl transition-all duration-300 ease-in-out focus:outline-none lg:max-w-lg"
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
						class="bg-quinary-900 placeholder-tertiary-200 focus:bg-tertiary-200 focus:text-quinary-900 focus:placeholder-quinary-900 w-full rounded border-none px-3 py-1 drop-shadow-xl transition-all duration-300 ease-in-out focus:outline-none lg:max-w-lg"
					/>
				</div>
				<div class="space-y-1">
					<p class="font-semibold uppercase">Created Date</p>
					<p class="opacity-50">
						{{
							userDetails.createdAt
								? new Date(userDetails.createdAt.toDate()).toLocaleDateString('fr-FR', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									})
								: 'N/A'
						}}
					</p>
				</div>
				<div class="space-y-1">
					<p class="font-semibold uppercase">Last Update</p>
					<p class="opacity-50">
						{{
							userDetails.updatedAt
								? new Date(userDetails.updatedAt.toDate()).toLocaleDateString('fr-FR', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									})
								: 'N/A'
						}}
					</p>
				</div>
			</div>

			<div class="space-y-1">
				<p class="font-semibold uppercase">Photo</p>
				<div class="flex flex-col gap-5">
					<NuxtImg
						:src="userDetails.photoURL"
						:alt="userDetails.name"
						class="aspect-video h-80 rounded object-cover"
					/>
					<div class="space-y-2 text-sm">
						<input
							id="search-input"
							v-model="searchInput"
							type="text"
							placeholder="Search Artist..."
							class="bg-quinary-900 placeholder-tertiary-200 focus:bg-tertiary-200 focus:text-quinary-900 focus:placeholder-quinary-900 w-full rounded border-none px-3 py-1 drop-shadow-xl transition-all duration-300 ease-in-out focus:outline-none"
						/>
						<div
							class="scrollBarLight grid max-h-[20dvh] w-full grid-cols-3 justify-between gap-2 overflow-hidden overflow-y-auto pr-2 xl:max-h-[50dvh] xl:grid-cols-5"
						>
							<button
								v-for="artist in artistFiltered"
								:key="artist.id"
								class="group bg-quinary-900 h-fit space-y-1 rounded p-1 text-center"
								@click="userDetails.photoURL = artist.image"
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
										class="bg-quinary-900/90 absolute inset-0 hidden items-center justify-center group-hover:flex"
									>
										<IconPlus class="text-tertiary-200 h-5 w-5" />
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
