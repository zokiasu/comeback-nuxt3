// Ce fichier de types Firebase est obsolète
// L'authentification se fait maintenant via Supabase
// Les types d'authentification sont définis dans les modules Supabase

// Peut être supprimé en toute sécurité

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
