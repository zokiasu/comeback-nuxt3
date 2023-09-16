<script setup>
const { releases } = defineProps({
  releases: {
    type: Array,
    required: true
  }
})
</script>
<template>
  <CardDefault name="Recent Releases" :class="{ 'hidden': !releases }">
    <div class="py-5 grid grid-cols-2 gap-5 w-full md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
      <CardRelease 
        v-for="release in releases" 
        :key="release.id" 
        :id="release.id" 
        :image="release.image"
        :date="release.date"
        :name="release.name"
        :type="release.type"
        :artistsId="release.artistsId"
        :artistsName="release.artistsName"
        :displayDate="true"
        class="mx-auto"
      />
    </div>
  </CardDefault>
</template>