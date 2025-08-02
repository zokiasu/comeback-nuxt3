<template>
	<div class="p-8">
		<h1 class="mb-4 text-2xl font-bold">Debug Simple</h1>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="rounded bg-gray-100 p-4">
				<h2 class="mb-2 font-semibold">Environment</h2>
				<ul class="space-y-1 text-sm">
					<li>Client: {{ process.client ? 'Yes' : 'No' }}</li>
					<li>Server: {{ process.server ? 'Yes' : 'No' }}</li>
					<li>Timestamp: {{ new Date().toISOString() }}</li>
				</ul>
			</div>

			<div class="rounded bg-gray-100 p-4">
				<h2 class="mb-2 font-semibold">Runtime Config</h2>
				<ul class="space-y-1 text-sm">
					<li>Config loaded: {{ configLoaded ? 'Yes' : 'No' }}</li>
					<li>Error: {{ configError || 'None' }}</li>
				</ul>
			</div>

			<div class="rounded bg-gray-100 p-4">
				<h2 class="mb-2 font-semibold">Test Actions</h2>
				<button @click="testBasic" class="mr-2 rounded bg-blue-500 px-4 py-2 text-white">
					Test Basic
				</button>
				<button @click="testSupabase" class="rounded bg-green-500 px-4 py-2 text-white">
					Test Supabase
				</button>
			</div>
		</div>

		<div v-if="testResults" class="mt-8 rounded bg-gray-100 p-4">
			<h2 class="mb-2 font-semibold">Test Results</h2>
			<pre class="text-sm">{{ testResults }}</pre>
		</div>
	</div>
</template>

<script setup lang="ts">
	// Vérifier si on est en mode développement
	const isDevelopment = process.env.NODE_ENV === 'development'

	// Si on n'est pas en développement, throw une erreur 404
	if (!isDevelopment) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Page Not Found',
		})
	}

	const configLoaded = ref(false)
	const configError = ref('')
	const testResults = ref('')

	try {
		const config = useRuntimeConfig()
		configLoaded.value = true
		console.log('Config loaded successfully')
	} catch (error) {
		configError.value = error.message
		console.error('Config error:', error)
	}

	const testBasic = () => {
		testResults.value = `Basic test successful at ${new Date().toISOString()}`
		console.log('Basic test completed')
	}

	const testSupabase = async () => {
		try {
			console.log('Testing Supabase connection')
			const supabase = useSupabaseClient()
			testResults.value = 'Supabase client created successfully'
			console.log('Supabase test successful')
		} catch (error) {
			console.error('Supabase error:', error)
			testResults.value = `Supabase Error: ${error.message}`
		}
	}

	// Test automatique au chargement
	onMounted(() => {
		console.log('Debug simple page mounted')
		testBasic()
	})
</script>
