<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Debug Simple</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-gray-100 p-4 rounded">
        <h2 class="font-semibold mb-2">Environment</h2>
        <ul class="text-sm space-y-1">
          <li>Client: {{ process.client ? 'Yes' : 'No' }}</li>
          <li>Server: {{ process.server ? 'Yes' : 'No' }}</li>
          <li>Timestamp: {{ new Date().toISOString() }}</li>
        </ul>
      </div>

      <div class="bg-gray-100 p-4 rounded">
        <h2 class="font-semibold mb-2">Runtime Config</h2>
        <ul class="text-sm space-y-1">
          <li>Config loaded: {{ configLoaded ? 'Yes' : 'No' }}</li>
          <li>Error: {{ configError || 'None' }}</li>
        </ul>
      </div>

      <div class="bg-gray-100 p-4 rounded">
        <h2 class="font-semibold mb-2">Test Actions</h2>
        <button @click="testBasic" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Test Basic
        </button>
        <button @click="testSupabase" class="bg-green-500 text-white px-4 py-2 rounded">
          Test Supabase
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