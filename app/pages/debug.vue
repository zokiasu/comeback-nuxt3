<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Debug Information</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-gray-100 p-4 rounded">
        <h2 class="font-semibold mb-2">Environment</h2>
        <ul class="text-sm space-y-1">
          <li>Mode: {{ $config.public.NODE_ENV || 'development' }}</li>
          <li>Client: {{ process.client ? 'Yes' : 'No' }}</li>
          <li>Server: {{ process.server ? 'Yes' : 'No' }}</li>
        </ul>
      </div>

      <div class="bg-gray-100 p-4 rounded">
        <h2 class="font-semibold mb-2">Supabase Config</h2>
        <ul class="text-sm space-y-1">
          <li>URL: {{ $config.public.SUPABASE_URL ? 'Set' : 'Missing' }}</li>
          <li>Key: {{ $config.public.SUPABASE_KEY ? 'Set' : 'Missing' }}</li>
          <li>Service Key: {{ $config.SUPABASE_SERVICE_KEY ? 'Set' : 'Missing' }}</li>
        </ul>
      </div>

      <div class="bg-gray-100 p-4 rounded">
        <h2 class="font-semibold mb-2">Auth Status</h2>
        <ul class="text-sm space-y-1">
          <li>User: {{ authUser ? 'Authenticated' : 'Not authenticated' }}</li>
          <li>Error: {{ authError || 'None' }}</li>
        </ul>
      </div>

      <div class="bg-gray-100 p-4 rounded">
        <h2 class="font-semibold mb-2">Test Actions</h2>
        <button @click="testSupabase" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Test Supabase
        </button>
        <button @click="testAlgolia" class="bg-green-500 text-white px-4 py-2 rounded">
          Test Algolia
        </button>
      </div>
    </div>

    <div v-if="testResults" class="mt-8 bg-gray-100 p-4 rounded">
      <h2 class="font-semibold mb-2">Test Results</h2>
      <pre class="text-sm">{{ testResults }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
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