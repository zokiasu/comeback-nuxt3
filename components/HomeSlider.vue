<template>
	<div
		class="relative max-h-[20rem] min-h-[20rem] w-full md:max-h-[30rem] md:min-h-[30rem] lg:aspect-video lg:max-h-[40rem] lg:min-h-[40rem]"
	>
		<transition name="fade" mode="out-in">
			<section v-if="newsToday.length > 0" class="absolute inset-0">
				<div class="absolute top-10 z-10">
					<p
						class="w-fit bg-red-700 py-1 pl-8 pr-5 text-xs font-semibold uppercase drop-shadow-lg lg:text-xl xl:text-2xl"
					>
						Comeback Today
					</p>
				</div>
				<ClientOnly>
					<swiper-container ref="swiperEl" :init="false" class="h-full">
						<swiper-slide
							v-for="comeback in newsToday"
							:key="comeback.id"
							class="relative h-full"
						>
							<ComebackSlider
								v-if="comeback.artist"
								:id="comeback.artist.id"
								:image="comeback.artist.image"
								:name="comeback.artist.name"
								class="h-full"
							/>
							<ComebackSlider
								v-else-if="comeback.artists && comeback.artists.length > 0"
								:id="comeback.artists[0].id"
								:image="comeback.artists[0].picture"
								:name="comeback.artists[0].name"
								class="h-full"
							/>
						</swiper-slide>
					</swiper-container>
				</ClientOnly>
			</section>

			<section
				v-else
				class="absolute inset-0 bg-[url('/slider-placeholder.webp')] bg-cover bg-center bg-no-repeat"
			>
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
				<p class="absolute inset-x-0 bottom-5 z-20 text-center text-primary">
					No Comeback Reported Today
				</p>
			</section>
		</transition>
	</div>
</template>

<script setup lang="ts">
	import { register } from 'swiper/element/bundle'
	import { onMounted, ref, nextTick } from 'vue'

	// Import des styles Swiper
	import 'swiper/css'
	import 'swiper/css/autoplay'
	import 'swiper/css/parallax'

	// Type pour l'élément Swiper
	interface SwiperContainer extends HTMLElement {
		initialize: () => void
		swiper?: any
	}

	// Référence vers le conteneur Swiper
	const swiperEl = ref<SwiperContainer | null>(null)

	interface Comeback {
		id: string
		artist?: {
			id: string
			image: string
			name: string
		}
		artists?: Array<{
			id: string
			picture: string
			name: string
		}>
	}

	const props = defineProps<{
		newsToday: Comeback[]
	}>()

	// Configuration du Swiper
	const swiperParams = {
		slidesPerView: 1,
		loop: true,
		parallax: true,
		autoplay: {
			delay: 3500,
			disableOnInteraction: false,
		},
	}

	// Enregistrer et initialiser Swiper uniquement côté client
	onMounted(() => {
		// Vérifier si window est défini (côté client)
		if (typeof window !== 'undefined') {
			register()

			// Attendre le prochain tick pour s'assurer que le DOM est prêt
			nextTick(() => {
				if (swiperEl.value) {
					Object.assign(swiperEl.value, swiperParams)
					swiperEl.value.initialize()
				}
			})
		}
	})
</script>

<style>
	/* Définir les animations */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active dans <2.1.8 */ {
		opacity: 0;
	}

	/* Styles Swiper */
	swiper-container {
		width: 100%;
		height: 100%;
		--swiper-theme-color: #fff;
	}

	swiper-slide {
		width: 100%;
		height: 100%;
	}

	:deep(swiper-slide img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
