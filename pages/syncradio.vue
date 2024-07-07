<script setup>
    import { useUserStore } from '~/stores/user'

    const route = useRoute()
    const userStore = useUserStore()

    const roomId = computed(() => route.query.id)
    const userData = computed(() => userStore.userDataStore)
    const isReady = computed(() => {
        if (route.query.id && userData.value.id && userData.value) {
            return true
        }
        return false
    })

    useHead({
        title: 'SyncRadio - Listen to Music Together in Real-Time',
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
                content: 'SyncRadio - Listen to Music Together in Real-Time'
            },
            {
                property: 'og:description',
                content: 'Join or create synchronized music rooms with SyncRadio. Listen to music together, no matter where you are. Immersive and community-driven experience guaranteed!'
            },
            {
                property: 'og:image',
                content: 'https://i.ibb.co/f4JQ8wR/Sync-Radio.webp' // Replace with the URL of the image to display when shared
            },
            {
                property: 'og:url',
                content: 'https://come-back.netlify.app/syncradio?id' + roomId // Replace with the URL of your page
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
                content: 'https://i.ibb.co/f4JQ8wR/Sync-Radio.webp' // Replace with the URL of the image to display when shared
            },
        ],
    })
</script>

<template>
    <div>
        <SyncRadioApp v-if="isReady" :roomId="roomId" />
        <SyncRadioIntro v-else />
    </div>
</template>