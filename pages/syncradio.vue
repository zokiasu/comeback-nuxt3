<script setup>
    import { useUserStore } from '~/stores/user'

    const route = useRoute()
    const userStore = useUserStore()

    const roomId = computed(() => route.query.id)
    const userData = computed(() => userStore.userDataStore)
    const isReady = computed(() => {
        if (route.query.id && userData.value.id) {
            return true
        }
        return false
    })
</script>

<template>
    <div>
        <SyncRadioApp v-if="isReady" :roomId="roomId" />
        <SyncRadioIntro v-else />
    </div>
</template>