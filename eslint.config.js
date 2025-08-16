// @ts-check
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import js from '@eslint/js'

export default [
	// Base configs
	js.configs.recommended,
	...vue.configs['flat/recommended'],
	prettier,

	// TypeScript files only
	...tseslint.configs.recommended.map((config) => ({
		...config,
		files: ['**/*.ts'],
	})),
	{
		files: ['**/*.ts'],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			globals: {
				// Node.js globals
				process: 'readonly',
				Buffer: 'readonly',
				global: 'readonly',
				module: 'readonly',
				require: 'readonly',

				// Browser globals
				window: 'readonly',
				document: 'readonly',

				// Nuxt 3 globals
				defineNuxtConfig: 'readonly',
				defineNuxtPlugin: 'readonly',
				defineAppConfig: 'readonly',
				definePageMeta: 'readonly',
				useNuxtApp: 'readonly',
				useRoute: 'readonly',
				useRouter: 'readonly',
				useFetch: 'readonly',
				$fetch: 'readonly',
				nextTick: 'readonly',

				// Vue globals
				defineComponent: 'readonly',
				defineAsyncComponent: 'readonly',
				defineCustomElement: 'readonly',
				defineModel: 'readonly',
				defineOptions: 'readonly',
				defineProps: 'readonly',
				defineEmits: 'readonly',
				defineExpose: 'readonly',
				defineSlots: 'readonly',
				withDefaults: 'readonly',

				// Composables
				ref: 'readonly',
				reactive: 'readonly',
				computed: 'readonly',
				watch: 'readonly',
				watchEffect: 'readonly',
				onMounted: 'readonly',
				onUnmounted: 'readonly',
				onUpdated: 'readonly',
				onBeforeMount: 'readonly',
				onBeforeUnmount: 'readonly',
				onBeforeUpdate: 'readonly',

				// Custom project composables
				useAuth: 'readonly',
				useErrorLogger: 'readonly',
				useToast: 'readonly',
				useSupabaseUser: 'readonly',
				useSupabaseClient: 'readonly',
				navigateTo: 'readonly',
				createError: 'readonly',
				useUserStore: 'readonly',
				defineNuxtRouteMiddleware: 'readonly',
				useHead: 'readonly',
				useTemplateRef: 'readonly',
				useIsPlayingVideo: 'readonly',
				useIdYoutubeVideo: 'readonly',
				useMusicNamePlaying: 'readonly',
				useAuthorNamePlaying: 'readonly',
				usePlaylist: 'readonly',

				// Types
				boolean: 'readonly',
				string: 'readonly',
				number: 'readonly',
				object: 'readonly',
				Ref: 'readonly',
				readonly: 'readonly',
			},
		},
		rules: {
			// TypeScript rules
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',

			// General rules
			'no-unused-vars': 'off', // Use TypeScript version instead
			'no-undef': 'warn',
			'no-console': 'warn',
		},
	},

	// Vue files - lighter rules
	{
		files: ['**/*.vue'],
		languageOptions: {
			globals: {
				// Vue compiler globals
				defineProps: 'readonly',
				defineEmits: 'readonly',
				defineExpose: 'readonly',
				defineSlots: 'readonly',
				defineModel: 'readonly',
				withDefaults: 'readonly',

				// Nuxt globals
				useNuxtApp: 'readonly',
				useRoute: 'readonly',
				useRouter: 'readonly',
				useFetch: 'readonly',
				useHead: 'readonly',
				navigateTo: 'readonly',

				// Vue composables
				ref: 'readonly',
				reactive: 'readonly',
				computed: 'readonly',
				watch: 'readonly',
				onMounted: 'readonly',
				onUnmounted: 'readonly',

				// Custom composables
				useAuth: 'readonly',
				useToast: 'readonly',
				useUserStore: 'readonly',
				useSupabaseUser: 'readonly',
				useSupabaseClient: 'readonly',
				useErrorLogger: 'readonly',
				usePlaylist: 'readonly',
				useIsPlayingVideo: 'readonly',
				useTemplateRef: 'readonly',
			},
		},
		rules: {
			// Vue rules
			'vue/multi-word-component-names': 'off',
			'vue/no-v-html': 'off',
			'vue/require-default-prop': 'off',

			// Disable strict rules for Vue files
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'no-console': 'warn',
		},
	},

	// Ignore patterns
	{
		ignores: [
			'.nuxt/**',
			'.output/**',
			'dist/**',
			'node_modules/**',
			'coverage/**',
			'*.min.js',
			'*.config.js',
			'prettier.config.js',
		],
	},
]
