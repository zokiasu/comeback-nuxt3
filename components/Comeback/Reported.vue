<script setup>
	const props = defineProps({
		comebackList: {
			type: Array,
			required: true,
		},
	})

	const displayAll = ref(false)
	const maxDisplay = ref(12)

	const comebackToDisplay = computed(() => {
		return displayAll.value
			? props.comebackList
			: props.comebackList.slice(0, maxDisplay.value)
	})

	const toggleDisplayAll = () => {
		displayAll.value = !displayAll.value
	}
</script>

<template>
	<CardDefault name="Comeback reported">
		<div
			v-if="props.comebackList.length"
			class="mb-5 grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3"
		>
			<CardNews
				v-for="comeback in comebackToDisplay"
				:key="comeback.id"
				:message="comeback.message"
				:date="comeback.date"
				:artist="comeback.artist"
				:artists="comeback.artists"
			/>
		</div>
		<div v-else class="grid grid-cols-1 gap-2 py-5 md:grid-cols-2 2xl:grid-cols-3">
			<SkeletonDefault
				v-for="i in maxDisplay"
				:key="`comeback_skeleton_` + i"
				class="h-12 rounded"
			/>
		</div>
		<div v-if="props.comebackList.length > maxDisplay" class="flex w-full justify-center">
			<button
				type="button"
				class="flex w-fit items-center gap-1 rounded border border-tertiary p-1 font-semibold"
				@click="toggleDisplayAll"
			>
				<IconPlus v-if="!displayAll" class="mx-auto h-3 w-3" />
				<IconMinus v-else class="mx-auto h-3 w-3" />
			</button>
		</div>
	</CardDefault>
</template>
