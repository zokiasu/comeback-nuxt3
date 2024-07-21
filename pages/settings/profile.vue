<script setup>
    import { useUserStore } from '~/stores/user'

    const userStore = useUserStore()
    const { getAllArtists, updateUserData } = useFirebaseFunction()

    const userData = computed(() => userStore.userDataStore)
    const userDetails = ref(null)
    const artistList = ref([])
    const searchInput = ref('')

    const artistFiltered = computed(() => {
        return artistList.value.filter((artist) => artist.name.toLowerCase().includes(searchInput.value.toLowerCase()))
    })

    const updateUserDetails = async () => {
        await updateUserData(userData.value)
    }

    onMounted(async () => {
        // copy userData to userDetails
        userDetails.value = { ...userData.value }
        artistList.value = await getAllArtists()
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
        <div v-if="userDetails" class="space-y-3">
            <div class="space-y-1">
                <p class="uppercase font-semibold">Picture</p>
                <div class="flex flex-col lg:flex-row items-center gap-5">
                    <NuxtImg
                        :src="userDetails.picture"
                        :alt="userDetails.name"
                        class="aspect-video object-cover h-60 bg-primary rounded"
                    />
                    <div class="space-y-2 text-sm">
                        <input
                            id="search-input"
                            v-model="searchInput"
                            type="text"
                            placeholder="Search Artist..."
                            class="w-full rounded border-none bg-quinary px-3 py-1 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
                        />
                        <div class="h-52 pr-2 overflow-hidden overflow-y-auto w-full grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-2 justify-between scrollBarLight">
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
                <p class="uppercase font-semibold">Role</p>
                <p class="opacity-50">{{ userDetails.role }}</p>
            </div>
            <div class="space-y-1">
                <p class="uppercase font-semibold">ID</p>
                <p class="opacity-50">{{ userDetails.id }}</p>
            </div>
        </div>
        <div class="flex">
            <button @click="updateUserDetails" class="bg-primary hover:bg-primary/90 rounded px-10 py-1">
                Save
            </button>
        </div>
    </div>
</template>