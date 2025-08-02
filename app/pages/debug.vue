<template>
	<div class="p-8">
		<div v-if="isDevelopment">
			<h1 class="mb-4 text-2xl font-bold">Debug Information</h1>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="rounded bg-gray-100 p-4">
					<h2 class="mb-2 font-semibold">Environment</h2>
					<ul class="space-y-1 text-sm">
						<li>Mode: {{ $config.public.NODE_ENV || 'development' }}</li>
						<li>Client: {{ process.client ? 'Yes' : 'No' }}</li>
						<li>Server: {{ process.server ? 'Yes' : 'No' }}</li>
					</ul>
				</div>

				<div class="rounded bg-gray-100 p-4">
					<h2 class="mb-2 font-semibold">Supabase Config</h2>
					<ul class="space-y-1 text-sm">
						<li>URL: {{ $config.public.SUPABASE_URL ? 'Set' : 'Missing' }}</li>
						<li>Key: {{ $config.public.SUPABASE_KEY ? 'Set' : 'Missing' }}</li>
						<li>Service Key: {{ $config.SUPABASE_SERVICE_KEY ? 'Set' : 'Missing' }}</li>
					</ul>
				</div>

				<div class="rounded bg-gray-100 p-4">
					<h2 class="mb-2 font-semibold">Auth Status</h2>
					<ul class="space-y-1 text-sm">
						<li>User: {{ authUser ? 'Authenticated' : 'Not authenticated' }}</li>
						<li>Error: {{ authError || 'None' }}</li>
					</ul>
				</div>

				<div class="rounded bg-gray-100 p-4">
					<h2 class="mb-2 font-semibold">Test Actions</h2>
					<button
						@click="testSupabase"
						class="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
					>
						Test Supabase
					</button>
					<button @click="testAlgolia" class="rounded bg-green-500 px-4 py-2 text-white">
						Test Algolia
					</button>
				</div>
			</div>

			<div v-if="testResults" class="mt-8 rounded bg-gray-100 p-4">
				<h2 class="mb-2 font-semibold">Test Results</h2>
				<pre class="text-sm">{{ testResults }}</pre>
			</div>
		</div>

		<div v-else class="text-center">
			<h1 class="mb-4 text-2xl font-bold">404 - Page Not Found</h1>
			<p class="text-gray-600">This page is only available in development mode.</p>
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

	const { logError, logInfo } = useErrorLogger()
	const authUser = useSupabaseUser()
	const authError = ref(null)
	const testResults = ref('')

	const testSupabase = async () => {
		try {
			logInfo('Testing Supabase connection')
			const supabase = useSupabaseClient()
			const { data, error } = await supabase.from('users').select('count').limit(1)

			if (error) {
				throw error
			}

			testResults.value = `Supabase OK: ${JSON.stringify(data)}`
			logInfo('Supabase test successful')
		} catch (error) {
			logError(error, 'supabase-test')
			testResults.value = `Supabase Error: ${error.message}`
			authError.value = error.message
		}
	}

	const testAlgolia = async () => {
		try {
			logInfo('Testing Algolia connection')
			// Test simple d'Algolia
			testResults.value = 'Algolia test - TODO'
			logInfo('Algolia test completed')
		} catch (error) {
			logError(error, 'algolia-test')
			testResults.value = `Algolia Error: ${error.message}`
		}
	}

	// Test automatique au chargement
	onMounted(async () => {
		logInfo('Debug page mounted')
		await testSupabase()
	})
</script>
