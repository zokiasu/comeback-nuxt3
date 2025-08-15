<script setup lang="ts">
	import { useSupabaseArtist } from '~/composables/Supabase/useSupabaseArtist'

	interface DeletionImpact {
		exclusiveReleases: { id: string; name: string }[]
		exclusiveMusics: { id: string; name: string }[]
		exclusiveNews: { id: string; message: string }[]
	}

	const props = defineProps<{
		isOpen: boolean
		artistId: string
		artistName: string
	}>()

	const emit = defineEmits<{
		close: []
		confirm: []
	}>()

	const { getArtistDeletionImpact, deleteArtistWithMode } = useSupabaseArtist()

	const isLoading = ref(false)
	const isDeleting = ref(false)
	const impact = ref<DeletionImpact | null>(null)
	const deletionMode = ref<'safe' | 'simple'>('safe')
	const isModalOpen = ref(false)

	// Synchroniser l'état local avec la prop
	watch(() => props.isOpen, (newValue) => {
		isModalOpen.value = newValue
		if (newValue && props.artistId) {
			deletionMode.value = 'safe'
			loadImpactAnalysis()
		}
	})

	// Émettre l'événement de fermeture quand l'état local change
	watch(isModalOpen, (newValue) => {
		if (!newValue) {
			emit('close')
		}
	})

	const loadImpactAnalysis = async () => {
		if (!props.artistId) return
		
		isLoading.value = true
		try {
			impact.value = await getArtistDeletionImpact(props.artistId)
		} catch (error) {
			console.error('Erreur lors de l\'analyse d\'impact:', error)
		} finally {
			isLoading.value = false
		}
	}

	const confirmDelete = async () => {
		if (!props.artistId) return
		
		isDeleting.value = true
		try {
			await deleteArtistWithMode(props.artistId, deletionMode.value)
			emit('confirm')
		} catch (error: any) {
			console.error('Erreur lors de la suppression:', error)
		} finally {
			isDeleting.value = false
		}
	}

	const close = () => {
		impact.value = null
		isModalOpen.value = false
	}

	const totalExclusiveItems = computed(() => {
		if (!impact.value) return 0
		return impact.value.exclusiveReleases.length + 
			   impact.value.exclusiveMusics.length + 
			   impact.value.exclusiveNews.length
	})
</script>

<template>
	<UModal v-model:open="isModalOpen" @close="close">
		<UCard>
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold text-red-600">
						🗑️ Suppression avancée
					</h3>
					<UButton
						color="gray"
						variant="ghost"
						icon="i-heroicons-x-mark-20-solid"
						@click="close"
					/>
				</div>
			</template>

			<div class="space-y-4">
				<div class="bg-red-50 border border-red-200 rounded-lg p-4">
					<p class="text-sm font-medium text-red-800">
						Supprimer l'artiste :
					</p>
					<p class="text-lg font-bold text-red-900 mt-1">
						{{ artistName }}
					</p>
				</div>

				<!-- Choix du mode de suppression -->
				<div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
					<h4 class="font-semibold text-gray-800 mb-3">
						Mode de suppression :
					</h4>
					
					<div class="space-y-3">
						<label class="flex items-start space-x-3 cursor-pointer">
							<input 
								v-model="deletionMode" 
								type="radio" 
								value="safe" 
								class="mt-1"
							>
							<div>
								<p class="font-medium text-green-700">🛡️ Suppression sécurisée (recommandé)</p>
								<p class="text-sm text-gray-600">
									Analyse le contenu et préserve les éléments partagés avec d'autres artistes
								</p>
							</div>
						</label>

						<label class="flex items-start space-x-3 cursor-pointer">
							<input 
								v-model="deletionMode" 
								type="radio" 
								value="simple" 
								class="mt-1"
							>
							<div>
								<p class="font-medium text-orange-700">⚡ Suppression rapide</p>
								<p class="text-sm text-gray-600">
									Supprime seulement les relations de l'artiste, plus rapide
								</p>
							</div>
						</label>
					</div>
				</div>

				<!-- Analyse d'impact (seulement en mode sécurisé) -->
				<div v-if="deletionMode === 'safe'">
					<div v-if="isLoading" class="flex justify-center py-6">
						<UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
						<span class="ml-2 text-sm text-gray-600">
							Analyse des conséquences...
						</span>
					</div>

					<div v-else-if="impact" class="space-y-4">
						<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
							<h4 class="font-semibold text-yellow-800 mb-3">
								📊 Contenu qui sera supprimé définitivement :
							</h4>
							
							<div class="text-sm space-y-2">
								<p>
									<strong>{{ impact.exclusiveReleases.length }}</strong> releases exclusives
									<strong>{{ impact.exclusiveMusics.length }}</strong> musiques exclusives
									<strong>{{ impact.exclusiveNews.length }}</strong> news exclusives
								</p>

								<div v-if="totalExclusiveItems === 0" class="text-green-600 font-medium">
									✅ Aucun contenu exclusif ne sera supprimé !
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="deletionMode === 'simple'" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
					<p class="text-sm text-orange-800">
						⚠️ <strong>Mode rapide :</strong> Seules les relations de l'artiste seront supprimées. 
						Le contenu (musiques, albums, news) restera dans la base de données.
					</p>
				</div>
			</div>

			<template #footer>
				<div class="flex justify-end space-x-3">
					<UButton color="gray" variant="outline" @click="close">
						Annuler
					</UButton>
					<UButton
						:color="deletionMode === 'safe' ? 'red' : 'orange'"
						:loading="isDeleting"
						:disabled="isLoading"
						@click="confirmDelete"
					>
						{{ isDeleting ? 'Suppression...' : 
						   deletionMode === 'safe' ? 'Supprimer (sécurisé)' : 'Supprimer (rapide)' }}
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>