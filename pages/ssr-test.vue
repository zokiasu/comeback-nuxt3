<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

// Test stores avec gestion SSR
let isLoginStore = ref(false)
let isAdminStore = ref(false)

// Gestion sécurisée des stores pour SSR
if (import.meta.client) {
	try {
		const userStore = useUserStore()
		const storeRefs = storeToRefs(userStore)
		isLoginStore = storeRefs.isLoginStore
		isAdminStore = storeRefs.isAdminStore
	} catch (error) {
		console.warn('Store error during SSR test:', error)
	}
}

// Test des composables Nuxt
const route = useRoute()
const router = useRouter()

// Test d'état réactif
const testData = ref('SSR Test Page')
const clientData = ref('Loading...')

// Test onMounted vs SSR
onMounted(() => {
	clientData.value = 'Client-side loaded!'
	console.log('✅ SSR Test: onMounted executed')
})

// Test import.meta.client/server
const isClient = import.meta.client
const isServer = import.meta.server

console.log('🔍 SSR Test: Rendering on', import.meta.client ? 'client' : 'server')
</script>

<template>
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		<h1 class="text-3xl font-bold mb-6">🧪 Test SSR</h1>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- État du rendu -->
			<div class="bg-gray-800 p-4 rounded-lg">
				<h2 class="text-xl font-semibold mb-4">🔄 État du rendu</h2>
				<ul class="space-y-2">
					<li>
						<span class="font-medium">Client:</span>
						<span :class="isClient ? 'text-green-400' : 'text-red-400'">
							{{ isClient ? '✅ Oui' : '❌ Non' }}
						</span>
					</li>
					<li>
						<span class="font-medium">Server:</span>
						<span :class="isServer ? 'text-green-400' : 'text-red-400'">
							{{ isServer ? '✅ Oui' : '❌ Non' }}
						</span>
					</li>
				</ul>
			</div>

			<!-- Test des stores -->
			<div class="bg-gray-800 p-4 rounded-lg">
				<h2 class="text-xl font-semibold mb-4">🏪 Stores Pinia</h2>
				<ul class="space-y-2">
					<li>
						<span class="font-medium">Login:</span>
						<span :class="isLoginStore ? 'text-green-400' : 'text-gray-400'">
							{{ isLoginStore ? '✅ Connecté' : '❌ Non connecté' }}
						</span>
					</li>
					<li>
						<span class="font-medium">Admin:</span>
						<span :class="isAdminStore ? 'text-green-400' : 'text-gray-400'">
							{{ isAdminStore ? '✅ Admin' : '❌ Utilisateur' }}
						</span>
					</li>
				</ul>
			</div>

			<!-- Test des données -->
			<div class="bg-gray-800 p-4 rounded-lg">
				<h2 class="text-xl font-semibold mb-4">📊 Données réactives</h2>
				<ul class="space-y-2">
					<li>
						<span class="font-medium">Données SSR:</span>
						<span class="text-blue-400">{{ testData }}</span>
					</li>
					<li>
						<span class="font-medium">Données client:</span>
						<span class="text-yellow-400">{{ clientData }}</span>
					</li>
				</ul>
			</div>

			<!-- Test des routes -->
			<div class="bg-gray-800 p-4 rounded-lg">
				<h2 class="text-xl font-semibold mb-4">🛣️ Routing</h2>
				<ul class="space-y-2">
					<li>
						<span class="font-medium">Route actuelle:</span>
						<span class="text-purple-400">{{ route.name }}</span>
					</li>
					<li>
						<span class="font-medium">Path:</span>
						<span class="text-purple-400">{{ route.path }}</span>
					</li>
				</ul>
			</div>
		</div>

		<!-- Navigation test -->
		<div class="mt-8 space-x-4">
			<NuxtLink to="/" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
				← Retour accueil
			</NuxtLink>
			<button 
				@click="router.push('/calendar')" 
				class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
			>
				Test navigation programmatique
			</button>
		</div>

		<!-- Logs -->
		<div class="mt-8 bg-gray-900 p-4 rounded-lg">
			<h3 class="text-lg font-semibold mb-2">📋 Logs (voir console)</h3>
			<p class="text-sm text-gray-400">
				Vérifiez la console pour voir les logs de rendu SSR/Client
			</p>
		</div>
	</div>
</template> 