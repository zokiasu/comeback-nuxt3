<script setup lang="ts">
	import { useAuth } from '@/composables/auth/auth.composable'

	const auth = ref(useAuth())

	const handleLoginWithGoogleClick = () => {
		auth.value.loginWithGoogle()
	}
</script>

<template>
	<div>
		<button
			class="tracking-wides bg-cb-quaternary-950 hover:bg-cb-primary-900 flex w-full flex-col items-center justify-center gap-3 rounded p-5 font-bold uppercase transition-all duration-500 ease-in-out"
			@click="handleLoginWithGoogleClick"
		>
			<IconGoogle class="h-10 w-10" />
			<p v-if="auth.isLoading" class="flex items-center justify-center gap-2">
				Loading...
			</p>
			<p v-else class="flex items-center justify-center gap-2">Login with Google</p>
		</button>
	</div>
</template>
