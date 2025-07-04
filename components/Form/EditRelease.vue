<script setup lang="ts">
	import type { Release } from '~/types'
	import { useSupabaseRelease } from '~/composables/Supabase/useSupabaseRelease'

	const props = defineProps({
		id: {
			type: String,
			required: true,
		},
		name: {
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
		date: {
			type: String,
			required: true,
		},
		yearReleased: {
			type: Number,
			required: true,
		},
		needToBeVerified: {
			type: Boolean,
			required: true,
		},
	})

	const emit = defineEmits(['saved', 'close'])

	const toast = useToast()
	const { updateRelease } = useSupabaseRelease()

	// Release types
	const releaseTypes = [
		{ label: 'Album', value: 'ALBUM' },
		{ label: 'Single', value: 'SINGLE' },
		{ label: 'EP', value: 'EP' },
		{ label: 'Compilation', value: 'COMPILATION' },
	]

	// Fonction pour formater la date au format YYYY-MM-DD pour l'input date
	const formatDateForInput = (dateString: string) => {
		if (!dateString) return ''

		try {
			const date = new Date(dateString)
			if (isNaN(date.getTime())) return ''

			// Formater au format YYYY-MM-DD
			return date.toISOString().split('T')[0]
		} catch (error) {
			console.error('Erreur lors du formatage de la date:', error)
			return ''
		}
	}

	// Reactive form data
	const formData = reactive({
		name: props.name,
		type: props.type,
		date: formatDateForInput(props.date),
		year: props.yearReleased,
		verified: !props.needToBeVerified,
		id_youtube_music: props.idYoutubeMusic,
	})

	const isLoading = ref(false)

	const saveChanges = async () => {
		if (!formData.name.trim()) {
			toast.add({
				title: 'Le nom de la release est requis',
				color: 'error',
			})
			return
		}

		isLoading.value = true

		try {
			const updates: Partial<Release> = {
				name: formData.name.trim(),
				type: formData.type as Release['type'],
				date: formData.date,
				year: formData.year,
				verified: formData.verified,
				id_youtube_music: formData.id_youtube_music,
				updated_at: new Date().toISOString(),
			}

			const result = await updateRelease(props.id, updates)

			if (result) {
				toast.add({
					title: 'Release mise à jour avec succès',
					color: 'success',
				})

				emit('saved', result)
				emit('close')
			} else {
				throw new Error('Échec de la mise à jour')
			}
		} catch (error) {
			console.error('Erreur lors de la mise à jour de la release:', error)
			toast.add({
				title: 'Erreur lors de la mise à jour',
				color: 'error',
			})
		} finally {
			isLoading.value = false
		}
	}

	// Watch pour mettre à jour les données du formulaire si les props changent
	watch(
		() => props,
		(newProps) => {
			formData.name = newProps.name
			formData.type = newProps.type
			formData.date = formatDateForInput(newProps.date)
			formData.year = newProps.yearReleased
			formData.verified = !newProps.needToBeVerified
			formData.id_youtube_music = newProps.idYoutubeMusic
		},
		{ deep: true },
	)
</script>

<template>
	<UForm @submit="saveChanges" class="space-y-4">
		<!-- Nom de la release -->
		<UFormField label="Nom" name="name" required>
			<UInput
				v-model="formData.name"
				placeholder="Nom de la release"
				:disabled="isLoading"
				class="w-full"
			/>
		</UFormField>

		<!-- Type -->
		<UFormField label="Type" name="type">
			<USelect
				v-model="formData.type"
				:items="releaseTypes"
				option-attribute="label"
				value-attribute="value"
				:disabled="isLoading"
				class="w-full"
			/>
		</UFormField>

		<!-- Date -->
		<UFormField label="Date" name="date">
			<UInput v-model="formData.date" type="date" :disabled="isLoading" class="w-full" />
		</UFormField>

		<!-- Année -->
		<UFormField label="Année" name="year">
			<UInput
				v-model.number="formData.year"
				type="number"
				:min="1900"
				:max="new Date().getFullYear() + 1"
				:disabled="isLoading"
				class="w-full"
			/>
		</UFormField>

		<!-- Statut vérifié -->
		<UFormField name="verified">
			<UCheckbox
				v-model="formData.verified"
				label="Release vérifiée"
				:disabled="isLoading"
			/>
		</UFormField>

		<!-- Actions -->
		<div class="flex justify-end space-x-3 pt-4">
			<UButton
				type="button"
				color="gray"
				variant="soft"
				@click="emit('close')"
				:disabled="isLoading"
			>
				Annuler
			</UButton>
			<UButton type="submit" :loading="isLoading">Sauvegarder</UButton>
		</div>
	</UForm>
</template>
