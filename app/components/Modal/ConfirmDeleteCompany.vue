<script setup lang="ts">
interface Props {
	isOpen: boolean
	companyId: string
	companyName: string
}

interface Emits {
	close: []
	confirm: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isDeleting = ref(false)

// Fonctions
const handleClose = () => {
	if (!isDeleting.value) {
		emit('close')
	}
}

const handleConfirm = async () => {
	isDeleting.value = true
	try {
		emit('confirm')
	} finally {
		isDeleting.value = false
	}
}

// Fermer le modal avec Escape
const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && props.isOpen) {
		handleClose()
	}
}

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
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
		@click.self="handleClose"
	>
		<div
			class="bg-cb-secondary-950 w-full max-w-md rounded-lg border border-cb-quinary-700 p-6 shadow-xl"
		>
			<!-- Header -->
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-white">Confirmer la suppression</h2>
				<button
					class="text-cb-tertiary-200 hover:text-white transition-colors"
					@click="handleClose"
					:disabled="isDeleting"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Contenu -->
			<div class="mb-6">
				<div class="mb-4 flex justify-center">
					<div class="bg-red-100 rounded-full p-3">
						<svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</div>
				</div>
				<p class="text-cb-tertiary-200 text-center">
					Êtes-vous sûr de vouloir supprimer la company
					<span class="font-semibold text-white">"{{ companyName }}"</span> ?
				</p>
				<p class="text-cb-tertiary-400 mt-2 text-center text-sm">
					Cette action est irréversible. Toutes les relations avec les artistes seront également supprimées.
				</p>
			</div>

			<!-- Actions -->
			<div class="flex justify-end space-x-3">
				<button
					class="bg-cb-quinary-700 hover:bg-cb-quinary-600 text-white rounded px-4 py-2 transition-colors"
					@click="handleClose"
					:disabled="isDeleting"
				>
					Annuler
				</button>
				<button
					class="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					@click="handleConfirm"
					:disabled="isDeleting"
				>
					<span v-if="isDeleting" class="flex items-center space-x-2">
						<svg class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						<span>Suppression...</span>
					</span>
					<span v-else>Supprimer définitivement</span>
				</button>
			</div>
		</div>
	</div>
</template>