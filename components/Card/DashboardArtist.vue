<script setup>
	const {
		id,
		image,
		name,
		description,
		type,
		idYoutubeMusic,
		styles,
		socialList,
		platformList,
		createdAt,
		updatedAt,
	} = defineProps({
		id: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		idYoutubeMusic: {
			type: String,
			required: true,
		},
		styles: {
			type: Array,
			required: true,
		},
		socialList: {
			type: Array,
			required: true,
		},
		platformList: {
			type: Array,
			required: true,
		},
		createdAt: {
			type: String,
			required: true,
		},
		updatedAt: {
			type: String,
			required: true,
		},
	})

	const skeleton = ref(null)
	const showFullDescription = ref(false)

	const createdAtDate = new Date(createdAt).toLocaleDateString('fr-FR', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
	})

	const updatedAtDate = new Date(updatedAt).toLocaleDateString('fr-FR', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
	})

	const emit = defineEmits(['deleteArtist'])
	const deleteArtist = () => {
		emit('deleteArtist', id)
	}

	const loadingDone = () => {
		skeleton.value.classList.add('opacity-0')
	}

	const socialLinksEl = ref(null)
	const platformsLinksEl = ref(null)

	// Exemple de référénces réactives pour le contrôle des éléments collapse
	const showSocialLinks = ref(false)
	const showPlatformsLinks = ref(false)

	// Fonctions de transition
	function beforeEnter(el) {
		el.style.height = '0'
	}

	function enter(el, done) {
		el.style.transition = 'height .3s ease'
		el.style.height = el.scrollHeight + 'px'
		el.addEventListener('transitionend', done, { once: true })
	}

	function afterEnter(el) {
		el.style.height = ''
	}

	function beforeLeave(el) {
		el.style.height = el.scrollHeight + 'px'
	}

	function leave(el, done) {
		el.style.transition = 'height .3s ease'
		el.style.height = '0'
		el.addEventListener('transitionend', done, { once: true })
	}

	function afterLeave(el) {
		el.style.height = ''
	}
</script>

<template>
	<div
		class="relative flex flex-col w-full h-full p-3 rounded list-complete-item bg-quaternary"
	>
		<div class="flex flex-col flex-grow space-y-2">
			<div class="relative">
				<div
					ref="skeleton"
					class="absolute inset-0 z-10 object-cover transition-all duration-1000 ease-in-out rounded animate-pulse bg-zinc-500"
				></div>
				<NuxtImg
					:src="image"
					:alt="name"
					format="webp"
					loading="lazy"
					class="object-cover w-full rounded aspect-video bg-zinc-500"
					@load="loadingDone"
				/>
			</div>

			<div class="flex items-center justify-between w-full">
				<div>
					<p class="space-x-1">
						<NuxtLink
							:to="'/artist/' + id"
							target="_blank"
							class="font-semibold hover:text-primary"
						>
							{{ name }}
						</NuxtLink>
						<span class="text-xs">[ {{ type }} ]</span>
					</p>
					<p class="text-xs">
						{{ idYoutubeMusic }}
					</p>
				</div>
				<div class="space-x-1">
					<NuxtLink
						:to="'/artist/edit/' + id"
						target="_blank"
						class="px-2 py-1 text-xs uppercase rounded bg-quinary hover:bg-zinc-500"
					>
						Edit
					</NuxtLink>
					<button
						class="px-2 py-1 text-xs uppercase rounded bg-quinary hover:bg-zinc-500"
						@click="deleteArtist"
					>
						Delete
					</button>
				</div>
			</div>

			<div v-if="styles.length" class="flex gap-1">
				<p
					v-for="style in styles"
					:key="style.name"
					class="px-2 py-1 text-xs uppercase rounded bg-quinary"
				>
					{{ style.name }}
				</p>
			</div>
			<div v-else>
				<p class="text-xs text-primary">No styles</p>
			</div>

			<div>
				<p
					v-if="description"
					:class="{ collapsed: !showFullDescription }"
					class="text-xs cursor-pointer"
					@click="showFullDescription = !showFullDescription"
				>
					{{ description }}
				</p>
				<p v-else class="text-xs text-primary">No description</p>
			</div>

			<div class="space-y-2">
				<div
					class="flex items-center justify-between w-full pb-1 border-b border-zinc-500"
					@click="showSocialLinks = !showSocialLinks"
				>
					<p class="text-sm font-semibold uppercase">
						Socials
						<span :class="{ 'text-primary': socialList.length === 0 }">
							({{ socialList.length }})
						</span>
					</p>
					<IconPlus v-if="!showSocialLinks" class="w-4 h-4" />
					<IconMinus v-else class="w-4 h-4" />
				</div>

				<transition
					@before-enter="beforeEnter"
					@enter="enter"
					@after-enter="afterEnter"
					@before-leave="beforeLeave"
					@leave="leave"
					@after-leave="afterLeave"
				>
					<div
						v-show="showSocialLinks"
						id="socialLinkContent"
						ref="socialLinksEl"
						class="overflow-hidden collapse-content"
					>
						<div v-if="socialList.length" class="flex flex-col space-y-1.5">
							<a
								v-for="social in socialList"
								:key="social"
								:href="social.link"
								target="_blank"
								class="overflow-hidden text-xs rounded bg-quinary"
							>
								<p class="bg-secondary px-1.5 py-1 uppercase">{{ social.name }}</p>
								<p class="px-1.5 py-1">{{ social.link }}</p>
							</a>
						</div>
						<p v-else class="px-2 py-1 text-xs text-center uppercase rounded bg-quinary">
							No Socials Link
						</p>
					</div>
				</transition>
			</div>

			<div class="space-y-2">
				<div
					class="flex items-center justify-between w-full pb-1 border-b border-zinc-500"
					@click="showPlatformsLinks = !showPlatformsLinks"
				>
					<p class="text-sm font-semibold uppercase">
						Platforms
						<span :class="{ 'text-primary': platformList.length === 0 }">
							({{ platformList.length }})
						</span>
					</p>
					<IconPlus v-if="!showPlatformsLinks" class="w-4 h-4" />
					<IconMinus v-else class="w-4 h-4" />
				</div>

				<transition
					@before-enter="beforeEnter"
					@enter="enter"
					@after-enter="afterEnter"
					@before-leave="beforeLeave"
					@leave="leave"
					@after-leave="afterLeave"
				>
					<div
						v-show="showPlatformsLinks"
						id="socialLinkContent"
						ref="platformsLinksEl"
						class="overflow-hidden collapse-content"
					>
						<div
							v-if="platformList.length"
							class="flex flex-col space-y-1 overflow-hidden"
						>
							<a
								v-for="platform in platformList"
								:key="platform"
								:href="platform.link"
								target="_blank"
								class="overflow-hidden text-xs rounded bg-quinary"
							>
								<p class="bg-secondary px-1.5 py-1 uppercase">{{ platform.name }}</p>
								<p class="px-1.5 py-1">{{ platform.link }}</p>
							</a>
						</div>
						<p v-else class="px-2 py-1 text-xs text-center uppercase rounded bg-quinary">
							No Platforms Link
						</p>
					</div>
				</transition>
			</div>
		</div>
		<div class="flex flex-col justify-between mt-auto text-xs md:flex-row">
			<p class="mt-auto">Created at {{ createdAtDate }}</p>
			<p class="mt-auto">Updated at {{ updatedAtDate }}</p>
		</div>
	</div>
</template>

<style scoped>
	.collapsed {
		display: -webkit-box;
		-webkit-line-clamp: 1; /* Limite à deux lignes */
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
