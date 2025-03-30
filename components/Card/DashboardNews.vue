<script setup lang="ts">
	import type { Artist } from '~/types/supabase/artist'
	
	const { id, message, artists, date } = defineProps({
		id: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		artists: {
			type: Array as PropType<Artist[]>,
			required: true,
		},
		date: {
			type: String,
			required: true,
		},
		user: {
			type: Object,
			required: true,
		},
		verified: {
			type: Boolean,
			required: true,
		},
	})

	const skeleton = ref<HTMLElement | null>(null)

	const loadingDone = () => {
		if (skeleton.value) skeleton.value.classList.add('opacity-0')
	}

	const convertDate = (timestamp: string) => {
		const date = new Date(timestamp)
		return date.toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	const emit = defineEmits(['deleteNews'])

	const deleteNews = () => {
		emit('deleteNews', id)
	}
</script>

<template>
	<div class="list-complete-item relative h-full space-y-2.5 rounded bg-quaternary p-3">
		<div class="grid grid-cols-3 gap-2">
			<div
				v-for="artistObject in artists"
				:key="artistObject.id"
				class="flex flex-col items-center justify-center w-full overflow-hidden rounded bg-quinary"
			>
				<NuxtImg
					:src="artistObject.image"
					:alt="artistObject.name"
					format="webp"
					loading="lazy"
					class="object-cover w-full h-10"
					@load="loadingDone"
				/>
				<p class="px-2 py-1">{{ artistObject.name }}</p>
			</div>
		</div>

		<div>
			<ComebackLabel label="Message" class="border-b border-zinc-500" />
			<p>{{ message }}</p>
		</div>

		<div>
			<ComebackLabel label="Date" class="border-b border-zinc-500" />
			<p>{{ convertDate(date) }}</p>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<button
				disabled
				class="px-3 py-1 transition-all duration-300 ease-in-out rounded bg-quinary hover:bg-tertiary/30"
			>
				Edit
			</button>
			<button
				class="px-3 py-1 transition-all duration-300 ease-in-out rounded bg-quinary hover:bg-tertiary/30"
				@click="deleteNews"
			>
				Delete
			</button>
		</div>
	</div>
</template>
