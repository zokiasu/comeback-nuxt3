<template>
	<div class="p-8">
		<h1 class="text-2xl font-bold mb-4">Test Error 500</h1>
		<div class="space-y-4">
			<div class="p-4 border rounded">
				<h2 class="font-semibold">Tests basiques :</h2>
				<p>✅ Page chargée</p>
				<p>✅ Template fonctionne</p>
			</div>

			<div class="p-4 border rounded">
				<h2 class="font-semibold">Test Supabase :</h2>
				<p>User: {{ user ? 'Connecté' : 'Non connecté' }}</p>
				<p>Error: {{ error }}</p>
			</div>

			<div class="p-4 border rounded">
				<h2 class="font-semibold">Test Store :</h2>
				<p>Store accessible: {{ storeAccessible }}</p>
				<p>Error: {{ storeError }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Désactiver tous les middlewares pour cette page
definePageMeta({
	middleware: []
})

const error = ref('')
const storeError = ref('')
const storeAccessible = ref(false)

// Test Supabase
let user = null
try {
	user = useSupabaseUser()
} catch (err: any) {
	error.value = err.message
}

// Test Store  
try {
	const userStore = useUserStore()
	storeAccessible.value = true
} catch (err: any) {
	storeError.value = err.message
}
</script> 