import type { Auth } from 'firebase/auth'

declare module '#app' {
	interface NuxtApp {
		$auth: Auth
	}
}

// Optionnel: Si vous utilisez $auth dans les templates Vue
declare module 'vue' {
	interface ComponentCustomProperties {
		$auth: Auth
	}
}
