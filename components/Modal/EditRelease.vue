<script setup lang="ts">
	import { Timestamp } from 'firebase/firestore'
	import VueDatePicker from '@vuepic/vue-datepicker'

	import { type Release } from '@/types/release'
	import { useFirebaseRelease } from '~/composables/useFirebaseRelease'

	const props = defineProps<{
		id: string
		name: string
		date: object
		yearReleased: number
		artistsName: string
		platformList: Array<{ name: string; link: string }>
		showModal: boolean
	}>()

	const emit = defineEmits(['verifiedRelease', 'update:showModal'])

	const toast = useToast()
	const { updateRelease } = useFirebaseRelease()
	const isLoading = ref(false)

	const dateToChange = ref(null)
	const releaseToUpdate = reactive<Release>({} as Release)

	releaseToUpdate.platformList = props.platformList
	releaseToUpdate.year = props.yearReleased

	const releaseDate = computed(() => {
		let dateComputed = new Date()
		if (props.date) {
			// @ts-ignore
			dateComputed = new Date(props.date.seconds * 1000)
			return `${dateComputed.getDate()}-${dateComputed.getMonth() + 1}-${dateComputed.getFullYear()}`
		} else {
			return 'No Date'
		}
	})

	const validVerifiedRelease = async () => {
		if (isLoading.value) return
		isLoading.value = true

		try {
			if (dateToChange.value) {
				const dateToTimestamp = new Timestamp(dateToChange.value / 1000, 0)
				if (dateToTimestamp.toDate().getFullYear() !== releaseToUpdate.year) {
					isLoading.value = false
					return
				} else {
					releaseToUpdate.needToBeVerified = false
				}
			}

			for (const key in releaseToUpdate) {
				// @ts-ignore
				if (releaseToUpdate[key] === '') {
					// @ts-ignore
					delete releaseToUpdate[key]
				}
			}

			const res = await updateRelease(props.id, releaseToUpdate)
			if (res === 'success') {
				emit('verifiedRelease')
				emit('update:showModal', false)
				toast.success('Release updated')
			} else {
				console.log('Error updating release')
				toast.error('Error updating release')
			}
		} catch (error) {
			console.error('Error updating release:', error)
			toast.error('Error updating release')
		} finally {
			isLoading.value = false
		}
	}

	watchEffect(() => {
		if (dateToChange.value) {
			const dateToTimestamp = new Timestamp(dateToChange.value / 1000, 0)
			releaseToUpdate.date = dateToTimestamp
			releaseToUpdate.year = dateToTimestamp.toDate().getFullYear()
		}
	})
</script>

<template>
	<div v-if="props.showModal" class="space-y-5 p-3">
		<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
			<div>
				<ComebackInput label="Artist Name" :placeholder="props.artistsName" disabled />
			</div>
			<div>
				<ComebackInput label="Release Name" :placeholder="props.name" />
			</div>
			<div class="space-y-2">
				<p class="text-sm font-semibold uppercase">DATE ({{ releaseDate }})</p>
				<VueDatePicker v-model="dateToChange" auto-apply :enable-time-picker="false" />
			</div>
			<div>
				<ComebackInput
					v-model="releaseToUpdate.year"
					label="YEAR"
					:placeholder="props.yearReleased.toString()"
				/>
			</div>
		</div>

		<!-- Platforms -->
		<div class="w-full space-y-2">
			<ComebackLabel label="Platforms" />
			<div
				v-for="(platform, index) in releaseToUpdate.platformList"
				:key="platform"
				class="flex w-full gap-1"
			>
				<div class="bg-quinary-900 w-full space-y-3 rounded p-2 text-xs">
					<input
						type="text"
						:value="platform.name"
						placeholder="Platform's Name"
						class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out outline-none"
						@input="
							(e) => {
								const target = e.target as HTMLInputElement
								releaseToUpdate.platformList[index].name = target.value
							}
						"
					/>
					<input
						type="text"
						:value="platform.link"
						placeholder="Platform's Link"
						class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out outline-none"
						@input="
							(e) => {
								const target = e.target as HTMLInputElement
								releaseToUpdate.platformList[index].link = target.value
							}
						"
					/>
				</div>
				<button
					class="bg-primary-900 rounded p-5 text-xs hover:bg-red-900"
					@click="
						releaseToUpdate.platformList.splice(
							releaseToUpdate.platformList.indexOf(platform),
							1,
						)
					"
				>
					Delete
				</button>
			</div>
			<button
				class="bg-primary-900 w-full rounded p-2 text-xs font-semibold uppercase hover:bg-red-900"
				@click="releaseToUpdate.platformList.push({ name: '', link: '' })"
			>
				Add Platforms
			</button>
		</div>

		<div class="flex justify-center">
			<button
				class="rounded bg-red-700 px-4 py-2 font-bold text-white transition-all duration-150 ease-in-out hover:bg-red-800 disabled:opacity-50"
				:disabled="isLoading"
				@click="validVerifiedRelease"
			>
				<span v-if="isLoading" class="flex items-center gap-2">
					<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
							fill="none"
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					Updating...
				</span>
				<span v-else>VALIDATE</span>
			</button>
		</div>
	</div>
</template>
