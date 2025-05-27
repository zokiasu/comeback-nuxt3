<template>
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="border-cb-primary-500 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"
			></div>
			<p class="text-lg">Connexion en cours...</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useSupabaseAuth } from '@/composables/auth/supabase-auth.composable'

	const { handleAuthCallback } = useSupabaseAuth()

	// Gérer le callback d'authentification au montage du composant
	onMounted(async () => {
		await handleAuthCallback()
	})
</script>
