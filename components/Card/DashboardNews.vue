<script setup>
	const { id, message, artist, artists, date } = defineProps({
		id: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		artist: {
			type: Object,
			required: false,
		},
		artists: {
			type: Object,
			required: false,
		},
		date: {
			type: Object,
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

	const skeleton = ref(null)

	const loadingDone = () => {
		if (skeleton.value) skeleton.value.classList.add('opacity-0')
	}

	const convertDate = (timestamp) => {
		const date = new Date(timestamp?.seconds * 1000)
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
				v-if="artist"
				class="flex w-full flex-col items-center justify-center overflow-hidden rounded bg-quinary"
			>
				<NuxtImg
					:src="artist.picture"
					:alt="artist.name"
					format="webp"
					loading="lazy"
					class="h-10 w-full object-cover"
					@load="loadingDone"
				/>
				<p class="px-2 py-1">{{ artist.name }}</p>
			</div>

			<div
				v-for="artistObject in artists"
				v-else
				:key="artistObject.id"
				class="flex w-full flex-col items-center justify-center overflow-hidden rounded bg-quinary"
			>
				<NuxtImg
					:src="artistObject.picture"
					:alt="artistObject.name"
					format="webp"
					loading="lazy"
					class="h-10 w-full object-cover"
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
				class="rounded bg-quinary px-3 py-1 transition-all duration-300 ease-in-out hover:bg-tertiary/30"
			>
				Edit
			</button>
			<button
				class="rounded bg-quinary px-3 py-1 transition-all duration-300 ease-in-out hover:bg-tertiary/30"
				@click="deleteNews"
			>
				Delete
			</button>
		</div>
	</div>
</template>
