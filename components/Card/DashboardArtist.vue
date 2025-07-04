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
		isActive: {
			type: Boolean,
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
	<div class="bg-cb-quaternary-950 flex h-full w-full flex-col justify-between rounded">
		<div class="flex justify-between border-b border-zinc-500 p-2 text-xs">
			<div class="flex items-center gap-1">
				<p v-if="!isActive" class="text-xs text-red-500">[Inactive]</p>
				<NuxtLink
					:to="'/artist/' + id"
					target="_blank"
					class="hover:text-cb-primary-900 font-semibold"
				>
					{{ name }}
				</NuxtLink>
			</div>
			<p class="text-xs">[ {{ type }} ]</p>
		</div>

		<div class="flex flex-col space-y-2 p-3">
			<NuxtImg
				:src="image"
				:alt="name"
				format="webp"
				loading="lazy"
				class="aspect-video w-full rounded bg-zinc-500 object-cover"
				@load="loadingDone"
			/>

			<div>
				<p
					v-if="description"
					:class="{ collapsed: !showFullDescription }"
					class="cursor-pointer text-xs"
					@click="showFullDescription = !showFullDescription"
				>
					{{ description }}
				</p>
				<p v-else class="text-cb-primary-900 text-xs">No description</p>
			</div>

			<div v-if="styles.length" class="flex flex-wrap gap-1">
				<p
					v-for="style in styles"
					:key="style"
					class="bg-cb-quinary-900 rounded px-2 py-1 text-xs uppercase"
				>
					{{ style }}
				</p>
			</div>
			<div v-else>
				<p class="text-cb-primary-900 text-xs">No styles</p>
			</div>

			<div class="space-y-2">
				<div
					class="flex w-full items-center justify-between border-b border-zinc-500 pb-1"
					@click="showSocialLinks = !showSocialLinks"
				>
					<p class="text-xs font-semibold uppercase">
						Socials
						<span :class="{ 'text-cb-primary-900': socialList.length === 0 }">
							({{ socialList.length }})
						</span>
					</p>
					<IconPlus v-if="!showSocialLinks" class="h-4 w-4" />
					<IconMinus v-else class="h-4 w-4" />
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
						class="collapse-content overflow-hidden"
					>
						<div v-if="socialList.length" class="flex flex-col space-y-1.5">
							<a
								v-for="social in socialList"
								:key="social"
								:href="social.link"
								target="_blank"
								class="bg-cb-quinary-900 overflow-hidden rounded text-xs"
							>
								<p class="bg-cb-secondary-950 px-1.5 py-1 uppercase">{{ social.name }}</p>
								<p class="px-1.5 py-1">{{ social.link }}</p>
							</a>
						</div>
						<p
							v-else
							class="bg-cb-quinary-900 rounded px-2 py-1 text-center text-xs uppercase"
						>
							No Socials Link
						</p>
					</div>
				</transition>
			</div>

			<div class="space-y-2">
				<div
					class="flex w-full items-center justify-between border-b border-zinc-500 pb-1"
					@click="showPlatformsLinks = !showPlatformsLinks"
				>
					<p class="text-xs font-semibold uppercase">
						Platforms
						<span :class="{ 'text-cb-primary-900': platformList.length === 0 }">
							({{ platformList.length }})
						</span>
					</p>
					<IconPlus v-if="!showPlatformsLinks" class="h-4 w-4" />
					<IconMinus v-else class="h-4 w-4" />
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
						class="collapse-content overflow-hidden"
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
								class="bg-cb-quinary-900 overflow-hidden rounded text-xs"
							>
								<p class="bg-cb-secondary-950 px-1.5 py-1 uppercase">
									{{ platform.name }}
								</p>
								<p class="px-1.5 py-1">{{ platform.link }}</p>
							</a>
						</div>
						<p
							v-else
							class="bg-cb-quinary-900 rounded px-2 py-1 text-center text-xs uppercase"
						>
							No Platforms Link
						</p>
					</div>
				</transition>
			</div>

			<div class="grid grid-cols-2 gap-1">
				<UButton
					:to="'/artist/edit/' + id"
					target="_blank"
					label="Edit"
					class="bg-cb-quinary-900 justify-center rounded px-2 py-1 text-xs font-normal text-white uppercase hover:bg-zinc-500"
				/>
				<UButton
					label="Delete"
					class="bg-cb-quinary-900 justify-center rounded px-2 py-1 text-xs font-normal text-white uppercase hover:bg-zinc-500"
					@click="deleteArtist"
				/>
			</div>
		</div>

		<div class="flex justify-between border-t border-zinc-500 p-2 text-xs">
			<p>Created at {{ createdAtDate }}</p>
			<p>Updated at {{ updatedAtDate }}</p>
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
