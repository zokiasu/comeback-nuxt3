<script setup lang="ts">
import { useSupabaseCompanies } from '~/composables/Supabase/useSupabaseCompanies'
import type { Company } from '~/composables/Supabase/useSupabaseCompanies'

interface Props {
	isOpen: boolean
	company: Company | null
	isCreating: boolean
}

interface Emits {
	close: []
	updated: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { 
	createCompany, 
	updateCompany, 
	companyExistsByName,
	companyTypes 
} = useSupabaseCompanies()

const toast = useToast()

// État du formulaire
const formData = reactive({
	name: '',
	description: '',
	type: '' as Company['type'] | '',
	website: '',
	founded_year: null as number | null,
	country: '',
	city: '',
	logo_url: '',
	verified: false
})

const isLoading = ref(false)
const errors = reactive({
	name: '',
	website: '',
	founded_year: ''
})

// Réinitialiser le formulaire
const resetForm = () => {
	Object.assign(formData, {
		name: '',
		description: '',
		type: '',
		website: '',
		founded_year: null,
		country: '',
		city: '',
		logo_url: '',
		verified: false
	})
	
	Object.assign(errors, {
		name: '',
		website: '',
		founded_year: ''
	})
}

// Charger les données de la company pour l'édition
const loadCompanyData = () => {
	if (props.company) {
		Object.assign(formData, {
			name: props.company.name || '',
			description: props.company.description || '',
			type: props.company.type || '',
			website: props.company.website || '',
			founded_year: props.company.founded_year || null,
			country: props.company.country || '',
			city: props.company.city || '',
			logo_url: props.company.logo_url || '',
			verified: props.company.verified || false
		})
	}
}

// Validation
const validateForm = async (): Promise<boolean> => {
	// Réinitialiser les erreurs
	Object.assign(errors, {
		name: '',
		website: '',
		founded_year: ''
	})

	let isValid = true

	// Validation du nom
	if (!formData.name.trim()) {
		errors.name = 'Le nom est requis'
		isValid = false
	} else if (formData.name.trim().length < 2) {
		errors.name = 'Le nom doit contenir au moins 2 caractères'
		isValid = false
	} else {
		// Vérifier l'unicité du nom
		try {
			const exists = await companyExistsByName(
				formData.name.trim(), 
				props.isCreating ? undefined : props.company?.id
			)
			if (exists) {
				errors.name = 'Une company avec ce nom existe déjà'
				isValid = false
			}
		} catch (error) {
			console.error('Erreur lors de la vérification du nom:', error)
		}
	}

	// Validation du site web
	if (formData.website && formData.website.trim()) {
		const websiteRegex = /^https?:\/\/.+\..+/
		if (!websiteRegex.test(formData.website.trim())) {
			errors.website = 'URL invalide (doit commencer par http:// ou https://)'
			isValid = false
		}
	}

	// Validation de l'année de création
	if (formData.founded_year !== null) {
		const currentYear = new Date().getFullYear()
		if (formData.founded_year < 1800 || formData.founded_year > currentYear) {
			errors.founded_year = `L'année doit être entre 1800 et ${currentYear}`
			isValid = false
		}
	}

	return isValid
}

// Soumettre le formulaire
const handleSubmit = async () => {
	isLoading.value = true

	try {
		const isValid = await validateForm()
		if (!isValid) {
			return
		}

		const companyData = {
			name: formData.name.trim(),
			description: formData.description.trim() || undefined,
			type: formData.type || undefined,
			website: formData.website.trim() || undefined,
			founded_year: formData.founded_year || undefined,
			country: formData.country.trim() || undefined,
			city: formData.city.trim() || undefined,
			logo_url: formData.logo_url.trim() || undefined,
			verified: formData.verified
		}

		if (props.isCreating) {
			await createCompany(companyData)
		} else if (props.company) {
			await updateCompany(props.company.id, companyData)
		}

		emit('updated')
	} catch (error: any) {
		console.error('Erreur lors de la soumission:', error)
		toast.add({
			title: 'Erreur',
			description: error.message || 'Une erreur est survenue',
			color: 'error'
		})
	} finally {
		isLoading.value = false
	}
}

// Fermer le modal
const handleClose = () => {
	if (!isLoading.value) {
		resetForm()
		emit('close')
	}
}

// Fermer le modal avec Escape
const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && props.isOpen && !isLoading.value) {
		handleClose()
	}
}

// Watchers
watch(() => props.isOpen, (isOpen) => {
	if (isOpen) {
		if (props.isCreating) {
			resetForm()
		} else {
			loadCompanyData()
		}
	}
})

onMounted(() => {
	document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
		@click.self="handleClose"
	>
		<div
			class="bg-cb-secondary-950 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-cb-quinary-700 shadow-xl"
		>
			<!-- Header -->
			<div class="sticky top-0 bg-cb-secondary-950 border-b border-cb-quinary-700 p-6">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-semibold text-white">
						{{ isCreating ? 'Créer une company' : 'Modifier la company' }}
					</h2>
					<button
						class="text-cb-tertiary-200 hover:text-white transition-colors"
						@click="handleClose"
						:disabled="isLoading"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>

			<!-- Formulaire -->
			<form @submit.prevent="handleSubmit" class="p-6 space-y-6">
				<!-- Nom (requis) -->
				<div>
					<label class="block text-sm font-medium text-cb-tertiary-200 mb-2">
						Nom de la company *
					</label>
					<input
						v-model="formData.name"
						type="text"
						required
						class="bg-cb-quinary-900 text-white w-full rounded border border-cb-quinary-700 px-3 py-2 focus:border-cb-primary-500 focus:outline-none"
						:class="{ 'border-red-500': errors.name }"
						placeholder="Ex: Universal Music Group"
					/>
					<p v-if="errors.name" class="mt-1 text-sm text-red-400">{{ errors.name }}</p>
				</div>

				<!-- Type -->
				<div>
					<label class="block text-sm font-medium text-cb-tertiary-200 mb-2">
						Type de company
					</label>
					<select
						v-model="formData.type"
						class="bg-cb-quinary-900 text-white w-full rounded border border-cb-quinary-700 px-3 py-2 focus:border-cb-primary-500 focus:outline-none"
					>
						<option value="">Sélectionner un type</option>
						<option v-for="type in companyTypes" :key="type" :value="type">
							{{ type }}
						</option>
					</select>
				</div>

				<!-- Description -->
				<div>
					<label class="block text-sm font-medium text-cb-tertiary-200 mb-2">
						Description
					</label>
					<textarea
						v-model="formData.description"
						rows="4"
						class="bg-cb-quinary-900 text-white w-full rounded border border-cb-quinary-700 px-3 py-2 focus:border-cb-primary-500 focus:outline-none resize-vertical"
						placeholder="Description de la company..."
					></textarea>
				</div>

				<!-- Website -->
				<div>
					<label class="block text-sm font-medium text-cb-tertiary-200 mb-2">
						Site web
					</label>
					<input
						v-model="formData.website"
						type="url"
						class="bg-cb-quinary-900 text-white w-full rounded border border-cb-quinary-700 px-3 py-2 focus:border-cb-primary-500 focus:outline-none"
						:class="{ 'border-red-500': errors.website }"
						placeholder="https://www.example.com"
					/>
					<p v-if="errors.website" class="mt-1 text-sm text-red-400">{{ errors.website }}</p>
				</div>

				<!-- Année de création et Localisation -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label class="block text-sm font-medium text-cb-tertiary-200 mb-2">
							Année de création
						</label>
						<input
							v-model.number="formData.founded_year"
							type="number"
							min="1800"
							:max="new Date().getFullYear()"
							class="bg-cb-quinary-900 text-white w-full rounded border border-cb-quinary-700 px-3 py-2 focus:border-cb-primary-500 focus:outline-none"
							:class="{ 'border-red-500': errors.founded_year }"
							placeholder="2000"
						/>
						<p v-if="errors.founded_year" class="mt-1 text-sm text-red-400">{{ errors.founded_year }}</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-cb-tertiary-200 mb-2">
							Pays
						</label>
						<input
							v-model="formData.country"
							type="text"
							class="bg-cb-quinary-900 text-white w-full rounded border border-cb-quinary-700 px-3 py-2 focus:border-cb-primary-500 focus:outline-none"
							placeholder="France"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-cb-tertiary-200 mb-2">
							Ville
						</label>
						<input
							v-model="formData.city"
							type="text"
							class="bg-cb-quinary-900 text-white w-full rounded border border-cb-quinary-700 px-3 py-2 focus:border-cb-primary-500 focus:outline-none"
							placeholder="Paris"
						/>
					</div>
				</div>

				<!-- Logo URL -->
				<div>
					<label class="block text-sm font-medium text-cb-tertiary-200 mb-2">
						URL du logo
					</label>
					<input
						v-model="formData.logo_url"
						type="url"
						class="bg-cb-quinary-900 text-white w-full rounded border border-cb-quinary-700 px-3 py-2 focus:border-cb-primary-500 focus:outline-none"
						placeholder="https://example.com/logo.png"
					/>
				</div>

				<!-- Vérification -->
				<div>
					<label class="flex items-center space-x-2">
						<input
							v-model="formData.verified"
							type="checkbox"
							class="rounded border-cb-quinary-700 text-cb-primary-500 focus:ring-cb-primary-500"
						/>
						<span class="text-sm text-cb-tertiary-200">Company vérifiée</span>
					</label>
				</div>

				<!-- Actions -->
				<div class="flex justify-end space-x-3 pt-4 border-t border-cb-quinary-700">
					<button
						type="button"
						class="bg-cb-quinary-700 hover:bg-cb-quinary-600 text-white rounded px-4 py-2 transition-colors"
						@click="handleClose"
						:disabled="isLoading"
					>
						Annuler
					</button>
					<button
						type="submit"
						class="bg-cb-primary-900 hover:bg-cb-primary-800 text-white rounded px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						:disabled="isLoading"
					>
						<span v-if="isLoading" class="flex items-center space-x-2">
							<svg class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
							<span>{{ isCreating ? 'Création...' : 'Mise à jour...' }}</span>
						</span>
						<span v-else>{{ isCreating ? 'Créer' : 'Mettre à jour' }}</span>
					</button>
				</div>
			</form>
		</div>
	</div>
</template>