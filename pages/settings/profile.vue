<script setup>
    import { useUserStore } from '~/stores/user'
    import { useToast } from 'vue-toastification'

    const userStore = useUserStore()
    const toast = useToast()
    const { getAllArtists, updateUserData, getUserData } = useFirebaseFunction()

    const userData = computed(() => userStore.userDataStore)
    const userDetails = ref(null)
    const artistList = ref([])
    const searchInput = ref('')

    const artistFiltered = computed(() => {
        return artistList.value.filter((artist) => artist.name.toLowerCase().includes(searchInput.value.toLowerCase()))
    })

    const updateUserDetails = async () => {
        await updateUserData(userDetails.value)
        userDetails.value = await getUserData(userDetails.value.id)
        toast.success('User details updated')
    }

    onMounted(async () => {
        artistList.value = await getAllArtists()
        userDetails.value = await getUserData(userStore.userDataStore.id)
    })
</script>

<template>
    <div class="h-screen min-h-dvh-wo-nav max-h-dvh-wo-nav rounded flex flex-col gap-5 px-5
    ">
        <div class="w-full flex justify-between">
            <p class="font-bold text-2xl">Profile Settings</p>
            <button @click="updateUserDetails" class="bg-primary hover:bg-primary/90 rounded px-5 py-1">
                Save
            </button>
        </div>
        <div v-if="userDetails" class="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <div class="space-y-5">
                <div class="space-y-1">
                    <p class="uppercase font-semibold">ID</p>
                    <p class="opacity-50">{{ userDetails.id }}</p>
                </div>
                <div class="space-y-1">
                    <p class="uppercase font-semibold">Role</p>
                    <p class="opacity-50">{{ userDetails.role }}</p>
                </div>
                <div class="space-y-1">
                    <p class="uppercase font-semibold">Username</p>
                    <!-- <p>{{ userDetails.name }}</p> -->
                    <input
                        id="userName"
                        v-model="userDetails.name"
                        type="text"
                        placeholder="Search Artist..."
                        class="w-full rounded border-none bg-quinary px-3 py-1 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out lg:max-w-lg focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
                    />
                </div>
                <div class="space-y-1">
                    <p class="uppercase font-semibold">Email</p>
                    <!-- <p>{{ userDetails.email }}</p> -->
                    <input
                        id="email"
                        v-model="userDetails.email"
                        type="text"
                        placeholder="Search Artist..."
                        class="w-full rounded border-none bg-quinary px-3 py-1 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out lg:max-w-lg focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
                    />
                </div>
                <div class="space-y-1">
                    <p class="uppercase font-semibold">Created Date</p>
                    <p class="opacity-50">{{ new Date(userDetails.createdAt.toDate()).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}</p>
                </div>
                <div class="space-y-1">
                    <p class="uppercase font-semibold">Last Update</p>
                    <p class="opacity-50">{{ new Date(userDetails.updatedAt.toDate()).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}</p>
                </div>
            </div>

            <div class="space-y-1">
                <p class="uppercase font-semibold">Picture</p>
                <div class="flex flex-col gap-5">
                    <NuxtImg
                        :src="userDetails.picture"
                        :alt="userDetails.name"
                        class="aspect-video object-cover h-80 rounded"
                    />
                    <div class="space-y-2 text-sm">
                        <input
                            id="search-input"
                            v-model="searchInput"
                            type="text"
                            placeholder="Search Artist..."
                            class="w-full rounded border-none bg-quinary px-3 py-1 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
                        />
                        <div class="pr-2 overflow-hidden overflow-y-auto w-full max-h-[20dvh] xl:max-h-[55dvh] grid grid-cols-3 xl:grid-cols-5 gap-2 justify-between scrollBarLight">
                            <button 
                                @click="userDetails.picture = artist.image" 
                                v-for="artist in artistFiltered" 
                                :key="artist.id" 
                                class="group rounded p-1 space-y-1 bg-quinary text-center h-fit"
                            >
                                <div class="relative">
                                    <NuxtImg
                                        :src="artist.image"
                                        :alt="artist.name"
                                        quality="20"
                                        loading="lazy"
                                        class="aspect-video object-cover w-full rounded"
                                    />
                                    <div class="absolute inset-0 items-center justify-center bg-quinary/90 hidden group-hover:flex">
                                        <IconPlus class="w-5 h-5 text-tertiary" />
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