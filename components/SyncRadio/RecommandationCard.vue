<script setup lang="ts">
    const { getRandomMusic } = useFirebaseFunction()

    const { isAdminRoom } = defineProps<{
        isAdminRoom: boolean;
    }>();

    const emit = defineEmits(['addInPlaylist']);

    const music = ref({} as any)

    const musicName = computed(() => music.value.name)
    const musicArtists = computed(() => music.value.artists[0].name)
    const hasMv = computed(() => music.value.hasMv || false)

    onMounted(async () => {
        music.value = await getRandomMusic()
    })

    const reloadRandomMusic = async () => {
        music.value = {}
        music.value = await getRandomMusic()
    }

    const addInPlaylist = () => {
        emit('addInPlaylist', music.value.videoId)
        reloadRandomMusic()
    }

    const sendMusic = () => {
        //console.log('sendMusic')
    }

    defineExpose({
    reloadRandomMusic
    })
</script>

<template>
    <div>
        <div v-if="music.name" class="w-full flex items-center justify-between py-2.5">
            <div class="flex-grow space-y-2 max-w-[60%]">
                <div class="relative h-[14px]">
                    <p class="truncate text-sm font-semibold hover:absolute hover:overflow-auto hover:z-10 hover:bg-quinary">{{ musicName }}</p>
                </div>
                <div class="flex gap-1 text-xs">
                    <p class="truncate">{{ musicArtists }}</p>
                    <p v-if="hasMv" class="bg-primary rounded px-1 font-semibold">MV</p>
                </div>
            </div>
            <div class="space-x-2">
                <button @click="reloadRandomMusic" class="rounded-lg p-2 transition-all ease-in-out duration-300 bg-quaternary hover:bg-primary">
                    <IconReload class="w-4 h-4" />
                </button>
                <button v-if="isAdminRoom" @click="addInPlaylist" class="rounded-lg p-2 transition-all ease-in-out duration-300 bg-quaternary hover:bg-primary">
                    <IconPlus class="w-4 h-4" />
                </button>
                <button v-else @click="sendMusic" disabled class="rounded-lg p-2 transition-all ease-in-out duration-300 bg-quaternary hover:bg-primary disabled:bg-secondary/30 disabled:hover:bg-secondary/30 disabled:text-tertiary/20">
                    <IconSend class="w-4 h-4" />
                </button>
            </div>
        </div>
        <SkeletonDefault v-else class="h-10 rounded-lg my-2" />
    </div>
</template>