<template>
  <div class="relative max-h-[20rem] min-h-[20rem] md:max-h-[30rem] md:min-h-[30rem] lg:aspect-video lg:max-h-[40rem] lg:min-h-[40rem] w-full">
    <transition name="fade" mode="out-in">
      <section v-if="newsToday.length > 0" class="absolute inset-0">
        <div class="absolute top-10 z-10">
          <p
            class="w-fit bg-red-700 py-1 pl-8 pr-5 text-xs font-semibold uppercase drop-shadow-lg lg:text-xl xl:text-2xl"
          >
            Comeback Today
          </p>
        </div>
        <Swiper
          :modules="[SwiperAutoplay, SwiperParallax]"
          :slides-per-view="1"
          :loop="true"
          :parallax="true"
          :autoplay="{
            delay: 3500,
            disableOnInteraction: false,
          }"
        >
          <SwiperSlide
            v-for="comeback in newsToday"
            :key="comeback.artist.id"
            class="swiper-slide relative"
          >
            <ComebackSlider
              :image="comeback.artist.image"
              :name="comeback.artist.name"
              :id="comeback.artist.id"
            />
          </SwiperSlide>
        </Swiper>
      </section>
      <section v-else class="absolute inset-0">
        <div
          class="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-1.5 bg-black/60 xl:space-y-5"
        >
          <p class="text-[2rem] font-bold sm:text-[6vw] xl:text-7xl">
            Don't miss any
            <span class="text-primary">Comeback</span>
          </p>
          <p class="text-[3vw] xl:text-3xl">
            Track every next release by your favorite artists
          </p>
        </div>
        <p class="absolute bottom-5 right-5 z-20 text-quinary">
          No Comeback Reported Today
        </p>
      </section>
    </transition>
  </div>
</template>

<script setup lang="ts">
const { newsToday } = defineProps({
  newsToday: {
    type: Array,
    required: true,
  },
})
</script>

<style>
/* Définir les animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active dans <2.1.8 */ {
  opacity: 0;
}
</style>