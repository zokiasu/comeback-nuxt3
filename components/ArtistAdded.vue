<script setup>
const { artists } = defineProps({
  artists: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <CardDefault name="Artist added">
    <div
      v-if="artists.length"
      class="relative w-full pb-5 flex justify-between gap-5 snap-x snap-mandatory overflow-x-auto scrollBarLight"
    >
      <CardObject 
        v-for="artist in artists"
        :key="artist.id"
        isArtist
        :artistId="artist.id"
        :mainTitle="artist.name"
        :subTitle="artist.type"
        :image="artist.image"
        :objectLink="`/artist/${artist.id}`"
        class="snap-start"
      />
    </div>
    <div v-else class="relative w-full pb-5 flex justify-between gap-5 snap-x snap-mandatory overflow-x-auto scrollBarLight">
      <SkeletonArtist v-for="i in 8" :key="`skeleton_artist_` + i" class="snap-start min-w-[10rem] max-w-[10rem]" />
    </div>
  </CardDefault>
</template>
