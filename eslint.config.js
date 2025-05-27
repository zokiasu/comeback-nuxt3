// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
	// Vos règles personnalisées ici
	{
		rules: {
			// Règles Vue
			'vue/multi-word-component-names': 'off',
			'vue/require-default-prop': 'off',
			'vue/no-template-shadow': 'warn',
			'vue/require-prop-types': 'warn',
			'vue/no-side-effects-in-computed-properties': 'warn',
			'vue/require-v-for-key': 'error',
			'vue/html-self-closing': 'off', // Désactiver pour éviter les conflits avec Prettier

			// Règles générales
			'no-console': 'off',
			'no-unused-vars': 'off', // Géré par TypeScript
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'require-await': 'off',
			'no-useless-escape': 'warn',
			eqeqeq: 'warn',
			camelcase: 'warn',
			'array-callback-return': 'warn',
			'no-dupe-keys': 'error',
			'no-constant-binary-expression': 'warn',
		},
	},
)
