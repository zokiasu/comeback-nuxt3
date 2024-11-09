<template>
    <div v-if="profileData" class="p-3 xl:p-5 space-y-5 min-h-dvh-wo-nav max-h-dvh-wo-nav xl:container xl:mx-auto">
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2 p-3 xl:p-5 rounded relative bg-quaternary">
            <NuxtImg
                :src="profileData.picture || 'https://i.ibb.co/wLhbFZx/Frame-255.png'"
                :alt="profileData.name"
                format="webp"
                loading="lazy"
                class="object-cover w-full rounded"
            />
            <div>
                <h1 class="text-2xl font-semibold">{{ profileData.name }}</h1>
                <p class="text-sm italic">{{ profileData.role }}</p>
            </div>
            <NuxtLink
                v-if="route.params.id === userDataStore.id"
                to="/settings/profile"
                class="bg-secondary absolute right-5 top-5 rounded px-2 py-1 text-xs font-semibold uppercase"
            >
                Edit Profile
            </NuxtLink>
            <p class="text-sm lg:absolute lg:bottom-5 lg:right-5">Registered at : {{ createdAt }}</p>
        </div>
        <div class="space-y-5 p-3 xl:p-5 rounded bg-quaternary">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold">Rankings</h2>
                <NuxtLink
                    to="/ranking/create"
                    class="bg-secondary rounded px-2 py-1 text-xs font-semibold uppercase"
                >
                    Create a Ranking
                </NuxtLink>
            </div>
            <div v-if="rankings" class="flex relative gap-2 xl:gap-5 overflow-x-auto remove-scrollbar">
                <CardProfileRanking v-for="ranking in rankings" :key="ranking.id" :ranking="ranking" :isProfile="isProfile" @delete="deleteRanking(ranking.id)" />
            </div>
        </div>
    </div>
    <div v-else class="p-5 space-y-5 flex justify-center items-center min-h-dvh-wo-nav max-h-dvh-wo-nav">
        <p class="text-center text-tertiary/50 font-semibold">Loading data...</p>
    </div>
</template>

<script setup>
  import { useUserStore } from '@/stores/user'  
  import { Timestamp } from 'firebase/firestore'
  import { useFirebaseRealtimeDatabase } from "~/composables/useFirebaseRealtimeDatabase";

  const route = useRoute()
  const { userDataStore } = useUserStore()
  const { readData, deleteData } = useFirebaseRealtimeDatabase();
  const { getUserData } = useFirebaseFunction()

  const createdAt = ref(null)
  const rankings = ref(null)
  const profileData = ref(null)

  const isProfile = computed(() => {
    return route.params.id === profileData.value.id
  })

  const deleteRanking = async (id) => {
    await deleteData(`/rankings/${userDataStore.id}/${id}`)
    rankings.value = rankings.value.filter(ranking => ranking.id !== id)
  }

  onMounted(async () => {
    profileData.value = await getUserData(route.params.id)
    const timestamp = new Timestamp(profileData.value.createdAt.seconds, profileData.value.createdAt.nanoseconds)
    createdAt.value = new Date(timestamp.toDate()).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
    rankings.value = await readData(`/rankings/${profileData.value.id}`)
    if (rankings.value) {
      rankings.value = Object.keys(rankings.value).map(key => ({ id: key, ...rankings.value[key] }))
    }
  })
</script>

