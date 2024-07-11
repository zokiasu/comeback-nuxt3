<script setup>
    import { useUserStore } from '~/stores/user'

    const route = useRoute()
    const userStore = useUserStore()
    const lastRoomYouTryToJoined = useLastRoomYouTryToJoined()

    const roomId = computed(() => route.query.id)
    const userData = computed(() => userStore.userDataStore)
    const isReady = computed(() => route.query.id && userData.value && userData.value.id)

    onMounted(async () => {
        if(roomId.value) {
            lastRoomYouTryToJoined.value = roomId.value
        }
    })

    const updateMetaTags = () => {
        const baseUrl = 'https://come-back.netlify.app/syncradio'
        const fullUrl = roomId.value ? `${baseUrl}?id=${roomId.value}` : baseUrl

        useHead({
            title: 'SyncRadio by Comeback - Listen to Music Together in Real-Time',
            meta: [
                {
                    name: 'description',
                    content: 'Join or create synchronized music rooms with SyncRadio. Listen to music together, no matter where you are. Immersive and community-driven experience guaranteed!'
                },
                {
                    name: 'keywords',
                    content: 'synchronized music, listen together, create music room, SyncRadio, collaborative playlists, online music, community experience'
                },
                {
                    property: 'og:title',
                    content: 'SyncRadio by Comeback - Listen to Music Together in Real-Time'
                },
                {
                    property: 'og:description',
                    content: 'Join or create synchronized music rooms with SyncRadio. Listen to music together, no matter where you are. Immersive and community-driven experience guaranteed!'
                },
                {
                    property: 'og:image',
                    content: 'https://i.ibb.co/f4JQ8wR/Sync-Radio.webp'
                },
                {
                    property: 'og:url',
                    content: fullUrl
                },
                {
                    name: 'twitter:card',
                    content: 'summary_large_image'
                },
                {
                    name: 'twitter:title',
                    content: 'SyncRadio - Listen to Music Together in Real-Time'
                },
                {
                    name: 'twitter:description',
                    content: 'Join or create synchronized music rooms with SyncRadio. Listen to music together, no matter where you are. Immersive and community-driven experience guaranteed!'
                },
                {
                    name: 'twitter:image',
                    content: 'https://i.ibb.co/f4JQ8wR/Sync-Radio.webp'
                },
                {
                    name: 'twitter:url',
                    content: fullUrl
                },
            ],
        })
    }

    // Update meta tags on component mount and when roomId changes
    watch(roomId, updateMetaTags, { immediate: true })
</script>

<template>
    <div>
        <SyncRadioApp v-if="isReady" :roomId="roomId" />
        <SyncRadioIntro v-else />
    </div>
</template>