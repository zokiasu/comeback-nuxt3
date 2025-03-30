<script setup lang="ts">
	import type { Artist } from '~/types/artist'

	const { message, date, artists } = defineProps<{
		message: string
		date: string
		artists?: Artist[] | undefined
	}>()

	function daysUntil(futureDate: Date) {
		const today = new Date()
		const future = new Date(futureDate)
		const differenceInTime = future.getTime() - today.getTime()
		const differenceInDays = differenceInTime / (1000 * 3600 * 24)
		return Math.ceil(differenceInDays)
	}

	function isDatePassed(date: Date) {
		const today = new Date().getTime()
		const inputDate = new Date(date)
		if (isNaN(inputDate.getTime())) {
			throw new TypeError('Invalid date format')
		}
		return inputDate.getTime() < today
	}

	function isSameDate(date: Date) {
		const today = new Date()
		const inputDate = new Date(date)
		if (isNaN(inputDate.getTime())) {
			throw new TypeError('Invalid date format')
		}
		return (
			inputDate.getFullYear() === today.getFullYear() &&
			inputDate.getMonth() === today.getMonth() &&
			inputDate.getDate() === today.getDate()
		)
	}

	const handleError = (artistName: string) => {
		console.error('Failed to load image', artistName)
	}
</script>

<template>
	<div
		class="flex w-full justify-between overflow-hidden rounded transition-all duration-500 ease-in-out"
	>
		<section
			v-if="artists"
			class="h-full w-full shrink space-y-1 overflow-hidden bg-quinary p-2"
		>
			<div class="flex flex-wrap gap-1">
				<NuxtLink
					v-for="(artistObject, index) in artists"
					:key="artistObject.id"
					:to="`/artist/${artistObject.id}`"
					class="group flex items-center gap-2"
				>
					<div class="relative hidden lg:block">
						<NuxtImg
							:src="artistObject.image"
							:alt="artistObject.name + 's picture'"
							format="webp"
							class="h-4 w-4 rounded-full object-cover"
							@error="handleError(artistObject.name)"
						/>
					</div>
					<h2
						class="truncate text-xs font-semibold transition-all duration-300 ease-in-out group-hover:text-primary lg:text-sm"
					>
						{{ artistObject.name }}
						<span
							v-if="artists.length > 1 && index != artists.length - 1"
							class="group-hover:text-tertiary"
						>
							,
						</span>
					</h2>
				</NuxtLink>
			</div>
			<p class="truncate text-xs">{{ message }}</p>
		</section>

		<section
			class="-mt-0.5 flex min-w-[18%] items-center justify-center bg-quaternary px-3 py-1 text-center md:mt-0 md:py-0"
		>
			<p
				v-if="!isDatePassed(new Date(date)) && !isSameDate(new Date(date))"
				class="my-auto whitespace-nowrap text-lg font-bold lg:text-xl"
			>
				D-{{ daysUntil(new Date(date)) }}
			</p>
			<p
				v-if="isSameDate(new Date(date))"
				class="my-auto whitespace-nowrap font-medium text-primary"
			>
				Today
			</p>
			<p
				v-if="!isSameDate(new Date(date)) && isDatePassed(new Date(date))"
				class="my-auto whitespace-nowrap font-medium text-primary"
			>
				Outed
			</p>
		</section>
	</div>
</template>

<style>
	.shadowCard {
		--tw-shadow: 5px 5px 5px 2px rgba(0, 0, 0, 0.3);
		box-shadow:
			var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
			var(--tw-shadow);
	}
</style>
