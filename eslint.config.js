// @ts-check
import vue from 'eslint-plugin-vue'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'

export default [
	{
		files: ['**/*.ts', '**/*.vue'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				project: ['./tsconfig.json'],
				extraFileExtensions: ['.vue'],
			},
		},
		plugins: {
			vue,
			'@typescript-eslint': tseslint,
		},
		extends: [
			'eslint:recommended',
			'plugin:vue/vue3-recommended',
			'plugin:@typescript-eslint/recommended',
			'plugin:prettier/recommended',
		],
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/no-v-html': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
		},
	},
	{
		files: ['*.js'],
		extends: ['eslint:recommended', 'plugin:prettier/recommended'],
	},
]
