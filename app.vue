<script setup>
	// L'authentification est maintenant gérée automatiquement par useAuth
	// via les watchers dans le composable

	// Logs pour débugger l'authentification
	const { user, userData, isLogin, isAdmin } = useAuth()

	// Watchers pour voir les changements d'état
	watch(
		user,
		(newUser) => {
			console.log(
				'🔍 Utilisateur Supabase:',
				newUser ? `${newUser.email} (${newUser.id})` : 'Non connecté',
			)
		},
		{ immediate: true },
	)

	watch(
		userData,
		(newUserData) => {
			console.log(
				'👤 Données utilisateur:',
				newUserData ? `${newUserData.name} (${newUserData.role})` : 'Aucune donnée',
			)
		},
		{ immediate: true },
	)

	watch(
		isLogin,
		(newIsLogin) => {
			console.log('🔐 État de connexion:', newIsLogin ? 'Connecté' : 'Non connecté')
		},
		{ immediate: true },
	)

	watch(
		isAdmin,
		(newIsAdmin) => {
			console.log('👑 Rôle admin:', newIsAdmin ? 'Admin' : 'Utilisateur normal')
		},
		{ immediate: true },
	)
</script>

<template>
	<UApp>
		<NuxtLayout>
			<NuxtLoadingIndicator color="#9E0102" />
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>

<style>
	/* Page Transitions - 0.4s Slide/Fade */
	.page-enter-active {
		transition-duration: 0.5s;
		transition-property: height, opacity, transform;
		transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
		overflow: hidden;
	}

	.page-leave-active {
		transition-duration: 0.5s;
		transition-property: height, opacity, transform;
		transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
		overflow: hidden;
	}

	.page-enter {
		opacity: 0;
	}

	.page-leave-active {
		opacity: 0;
	}
</style>
