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
			class="tracking-wides flex w-full flex-col items-center justify-center gap-3 rounded bg-quaternary p-5 font-bold uppercase transition-all duration-500 ease-in-out hover:bg-primary"
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
