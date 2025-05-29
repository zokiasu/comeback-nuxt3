<template>
	<div class="p-8">
		<h1 class="mb-4 text-2xl font-bold">Test d'authentification</h1>

		<div class="space-y-4">
			<div class="rounded bg-gray-100 p-4">
				<h2 class="font-semibold">État de l'utilisateur Supabase :</h2>
				<pre class="text-sm">{{ user ? 'Connecté' : 'Non connecté' }}</pre>
				<pre v-if="user" class="mt-2 text-xs">{{ JSON.stringify(user, null, 2) }}</pre>
			</div>

			<div class="rounded bg-gray-100 p-4">
				<h2 class="font-semibold">Données utilisateur (store) :</h2>
				<pre class="text-sm">{{ userData ? 'Données présentes' : 'Pas de données' }}</pre>
				<pre v-if="userData" class="mt-2 text-xs">{{
					JSON.stringify(userData, null, 2)
				}}</pre>
			</div>

			<div class="rounded bg-gray-100 p-4">
				<h2 class="font-semibold">État de connexion :</h2>
				<pre class="text-sm">{{ isLogin ? 'Connecté' : 'Non connecté' }}</pre>
			</div>

			<div class="rounded bg-gray-100 p-4">
				<h2 class="font-semibold">Rôle admin :</h2>
				<pre class="text-sm">{{ isAdmin ? 'Admin' : 'Utilisateur normal' }}</pre>
			</div>

			<div class="space-x-4">
				<button
					v-if="!user"
					@click="navigateTo('/authentification')"
					class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>
					Se connecter
				</button>

				<button
					v-if="user"
					@click="logout"
					class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
				>
					Se déconnecter
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	const { user, userData, isLogin, isAdmin, logout } = useAuth()

	console.log('🧪 Page de test - État initial:', {
		user: !!user,
		userData: !!userData,
		isLogin,
		isAdmin,
	})
</script>
