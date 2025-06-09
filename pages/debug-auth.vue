<template>
	<div class="p-8">
		<h1 class="mb-4 text-2xl font-bold">Debug Authentification Simple</h1>

		<div class="space-y-4">
			<div class="rounded border p-4">
				<h2 class="font-semibold">État brut Supabase User:</h2>
				<p>Utilisateur connecté: {{ !!user }}</p>
				<p v-if="user">Email: {{ user.email }}</p>
				<p v-if="user">ID: {{ user.id }}</p>
			</div>

			<div class="space-x-4">
				<button
					@click="testLogin"
					class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>
					Test Login Google
				</button>

				<button
					@click="testLogout"
					class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
				>
					Déconnexion
				</button>

				<button
					@click="checkSession"
					class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
				>
					Vérifier Session
				</button>
			</div>

			<div class="rounded bg-gray-100 p-4">
				<h3 class="font-semibold">Logs:</h3>
				<div class="mt-2 text-sm">
					<div v-for="log in logs" :key="log.id" class="mb-1">
						<span class="text-gray-500">{{ log.time }}</span>
						- {{ log.message }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	// Désactiver le middleware pour cette page
	definePageMeta({
		middleware: [],
	})

	const user = useSupabaseUser()
	const supabase = useSupabaseClient()

	const logs = ref<Array<{ id: number; time: string; message: string }>>([])
	let logId = 0

	const addLog = (message: string) => {
		logs.value.unshift({
			id: logId++,
			time: new Date().toLocaleTimeString(),
			message,
		})
		console.log(message)
	}

	const testLogin = async () => {
		addLog('🚀 Début de la connexion Google...')

		try {
			const redirectTo = import.meta.client ? `${window.location.origin}/auth/callback` : undefined
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo,
				},
			})

			if (error) {
				addLog(`❌ Erreur: ${error.message}`)
			} else {
				addLog('✅ Redirection vers Google initiée')
			}
		} catch (err: any) {
			addLog(`❌ Erreur: ${err.message}`)
		}
	}

	const testLogout = async () => {
		addLog('👋 Déconnexion...')

		try {
			const { error } = await supabase.auth.signOut()
			if (error) {
				addLog(`❌ Erreur déconnexion: ${error.message}`)
			} else {
				addLog('✅ Déconnexion réussie')
			}
		} catch (err: any) {
			addLog(`❌ Erreur: ${err.message}`)
		}
	}

	const checkSession = async () => {
		addLog('🔍 Vérification de la session...')

		try {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession()

			if (error) {
				addLog(`❌ Erreur session: ${error.message}`)
			} else if (session) {
				addLog(`✅ Session active: ${session.user.email}`)
			} else {
				addLog('❌ Aucune session active')
			}
		} catch (err: any) {
			addLog(`❌ Erreur: ${err.message}`)
		}
	}

	// Watcher pour les changements d'utilisateur
	watch(user, (newUser, oldUser) => {
		if (newUser && !oldUser) {
			addLog(`👤 Utilisateur connecté: ${newUser.email}`)
		} else if (!newUser && oldUser) {
			addLog('👋 Utilisateur déconnecté')
		}
	})

	// Vérifier la session au chargement
	onMounted(() => {
		addLog('📄 Page chargée')
		checkSession()
	})
</script>
