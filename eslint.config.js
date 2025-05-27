import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
	// Base JavaScript config
	js.configs.recommended,

	// Vue files
	{
		files: ['**/*.vue'],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: typescriptParser,
				ecmaVersion: 'latest',
				sourceType: 'module',
				extraFileExtensions: ['.vue'],
			},
			globals: {
				// Vue Composition API
				ref: 'readonly',
				reactive: 'readonly',
				computed: 'readonly',
				watch: 'readonly',
				watchEffect: 'readonly',
				onMounted: 'readonly',
				onBeforeUnmount: 'readonly',
				nextTick: 'readonly',
				PropType: 'readonly',
				// Nuxt auto-imports
				useRoute: 'readonly',
				useRouter: 'readonly',
				useHead: 'readonly',
				useState: 'readonly',
				useAsyncData: 'readonly',
				useNuxtApp: 'readonly',
				useRuntimeConfig: 'readonly',
				useToast: 'readonly',
				navigateTo: 'readonly',
				createError: 'readonly',
				defineNuxtPlugin: 'readonly',
				defineNuxtConfig: 'readonly',
				defineNuxtRouteMiddleware: 'readonly',
				defineAppConfig: 'readonly',
				// Custom composables (add your own here)
				useSupabase: 'readonly',
				useUserStore: 'readonly',
				useIdYoutubeVideo: 'readonly',
				useIsPlayingVideo: 'readonly',
				useMusicNamePlaying: 'readonly',
				useAuthorNamePlaying: 'readonly',
				useLastRoomYouTryToJoined: 'readonly',
				useAlgoliaSearch: 'readonly',
				useDebounce: 'readonly',
				signOutApp: 'readonly',
				debounce: 'readonly',
				userId: 'readonly',
				// Browser APIs
				window: 'readonly',
				document: 'readonly',
				console: 'readonly',
				setTimeout: 'readonly',
				setInterval: 'readonly',
				clearTimeout: 'readonly',
				clearInterval: 'readonly',
				fetch: 'readonly',
				navigator: 'readonly',
				HTMLElement: 'readonly',
				HTMLTextAreaElement: 'readonly',
				Event: 'readonly',
				IntersectionObserver: 'readonly',
				// Node.js
				process: 'readonly',
				module: 'readonly',
				NodeJS: 'readonly',
			},
		},
		plugins: {
			vue,
			'@typescript-eslint': typescript,
			prettier,
		},
		rules: {
			...vue.configs['vue3-recommended'].rules,
			...typescript.configs.recommended.rules,

			// Custom rules
			'import/first': 'off',
			'vue/multi-word-component-names': 'off',
			'prettier/prettier': ['error', { endOfLine: 'auto' }],
			'no-console': 'off',
			'no-unused-vars': 'off', // Handled by TypeScript
			'@typescript-eslint/no-unused-vars': 'warn',
			'vue/require-default-prop': 'off',
			'require-await': 'off',
			'no-useless-escape': 'warn',
			eqeqeq: 'warn',
			camelcase: 'warn',
			'vue/no-template-shadow': 'warn',
			'vue/require-prop-types': 'warn',
			'array-callback-return': 'warn',
			'vue/no-side-effects-in-computed-properties': 'warn',
			'vue/require-v-for-key': 'error',
			'no-dupe-keys': 'error',
			'@typescript-eslint/no-explicit-any': 'warn',
			'no-constant-binary-expression': 'warn',
		},
	},

	// TypeScript files
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			globals: {
				// Vue Composition API
				ref: 'readonly',
				reactive: 'readonly',
				computed: 'readonly',
				watch: 'readonly',
				watchEffect: 'readonly',
				onMounted: 'readonly',
				onBeforeUnmount: 'readonly',
				nextTick: 'readonly',
				PropType: 'readonly',
				// Nuxt auto-imports
				useRoute: 'readonly',
				useRouter: 'readonly',
				useHead: 'readonly',
				useState: 'readonly',
				useAsyncData: 'readonly',
				useNuxtApp: 'readonly',
				useRuntimeConfig: 'readonly',
				useToast: 'readonly',
				navigateTo: 'readonly',
				createError: 'readonly',
				defineNuxtPlugin: 'readonly',
				defineNuxtConfig: 'readonly',
				defineNuxtRouteMiddleware: 'readonly',
				defineAppConfig: 'readonly',
				// Browser APIs
				console: 'readonly',
				setTimeout: 'readonly',
				setInterval: 'readonly',
				clearTimeout: 'readonly',
				clearInterval: 'readonly',
				fetch: 'readonly',
				// Node.js
				process: 'readonly',
				module: 'readonly',
				NodeJS: 'readonly',
			},
		},
		plugins: {
			'@typescript-eslint': typescript,
			prettier,
		},
		rules: {
			...typescript.configs.recommended.rules,

			// Custom rules
			'prettier/prettier': ['error', { endOfLine: 'auto' }],
			'no-console': 'off',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'require-await': 'off',
			'no-useless-escape': 'warn',
			eqeqeq: 'warn',
			camelcase: 'warn',
			'array-callback-return': 'warn',
			'no-dupe-keys': 'error',
			'@typescript-eslint/no-explicit-any': 'warn',
			'n/no-callback-literal': 'off',
		},
	},

	// JavaScript files
	{
		files: ['**/*.js', '**/*.mjs'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				// Node.js
				console: 'readonly',
				process: 'readonly',
				module: 'readonly',
				// Browser APIs
				setTimeout: 'readonly',
				setInterval: 'readonly',
				clearTimeout: 'readonly',
				clearInterval: 'readonly',
			},
		},
		plugins: {
			prettier,
		},
		rules: {
			'prettier/prettier': ['error', { endOfLine: 'auto' }],
			'no-console': 'off',
			'no-unused-vars': 'warn',
			'require-await': 'off',
			'no-useless-escape': 'warn',
			eqeqeq: 'warn',
			camelcase: 'warn',
			'array-callback-return': 'warn',
			'no-dupe-keys': 'error',
		},
	},

	// Prettier config (disables conflicting rules)
	prettierConfig,

	// Global ignores
	{
		ignores: ['node_modules/**', '.nuxt/**', '.output/**', 'dist/**', '.nitro/**'],
	},
]
