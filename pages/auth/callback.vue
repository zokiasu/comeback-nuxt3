<template>
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"
			></div>
			<p class="text-gray-600">Connexion en cours...</p>
		</div>
	</div>
</template>

<script setup>
	const { upsertUserProfile } = useSupabaseAuth()
	const supabase = useSupabaseClient()

	onMounted(async () => {
		try {
			// Récupérer la session après le callback OAuth
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession()

			if (error) {
				console.error('Erreur récupération session:', error)
				await navigateTo('/login?error=auth_failed')
				return
			}

			if (session?.user) {
				// Créer ou mettre à jour le profil utilisateur
				await upsertUserProfile({
					id: session.user.id,
					email: session.user.email || '',
					name:
						session.user.user_metadata?.full_name ||
						session.user.user_metadata?.name ||
						'Utilisateur',
					photo_url:
						session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
					role: 'USER', // Par défaut, les nouveaux utilisateurs sont USER
				})

				// Redirection vers le dashboard ou la page d'origine
				const redirectTo = sessionStorage.getItem('auth_redirect') || '/'
				sessionStorage.removeItem('auth_redirect')
				await navigateTo(redirectTo)
			} else {
				await navigateTo('/login?error=no_session')
			}
		} catch (error) {
			console.error('Erreur callback auth:', error)
			await navigateTo('/login?error=callback_failed')
		}
	})
</script>
