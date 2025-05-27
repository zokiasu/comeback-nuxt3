// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	compatibilityDate: '2025-05-27',

	modules: [
		'@pinia/nuxt',
		'@nuxt/image',
		'@nuxtjs/algolia',
		'@nuxt/ui',
		'@vite-pwa/nuxt',
		'@nuxtjs/supabase',
		'@nuxt/eslint',
	],

	css: ['~/assets/css/tailwind.css'],

	ssr: true,

	devtools: { enabled: true },

	vite: {
		plugins: [tailwindcss()],
		build: {
			chunkSizeWarningLimit: 1600,
		},
	},

	runtimeConfig: {
		public: {
			YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
			ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
			ALGOLIA_APPLICATION_ID: process.env.ALGOLIA_APPLICATION_ID,
			ALGOLIA_INDEX_NAME: process.env.ALGOLIA_INDEX_NAME,
			SUPABASE_URL: process.env.SUPABASE_URL,
			SUPABASE_KEY: process.env.SUPABASE_KEY,
			SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
		},
		SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
	},

	supabase: {
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,
		serviceKey: process.env.SUPABASE_SERVICE_KEY,
		redirectOptions: {
			login: '/authentification',
			callback: '/auth/callback',
			exclude: ['/'],
			saveRedirectToCookie: true,
		},
		types: './types/supabase.ts',
	},

	experimental: {
		payloadExtraction: false,
	},

	typescript: {
		strict: true,
		typeCheck: false,
	},

	build: {
		transpile: ['swiper', 'tslib'],
	},

	app: {
		head: {
			htmlAttrs: {
				lang: 'fr',
			},
			link: [
				{
					rel: 'icon',
					type: 'image/x-icon',
					href: '/favicon.ico',
				},
				{
					rel: 'preconnect',
					href: 'https://fonts.googleapis.com',
				},
				{
					rel: 'preconnect',
					href: 'https://fonts.gstatic.com',
					crossorigin: 'anonymous',
				},
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
				},
			],
			meta: [
				{ charset: 'utf-8' },
				{ name: 'robots', content: 'noindex,nofollow' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'theme-color', content: '#9E0102' },
				{
					name: 'description',
					content:
						"Don't miss any Comeback. Track every next release by your favorite artists.",
				},
				{
					property: 'og:site_name',
					content: 'Comeback - Track every next release by your favorite artists.',
				},
				{
					property: 'og:type',
					content: 'website',
				},
				{
					property: 'og:title',
					content: 'Comeback - Track every next release by your favorite artists.',
				},
				{
					property: 'og:description',
					content:
						"Don't miss any Comeback. Track every next release by your favorite artists.",
				},
				{
					property: 'og:url',
					content: 'https://come-back.netlify.app/',
				},
				{
					property: 'og:image',
					content: 'https://nuxt-firebase-auth.vercel.app/ogp.png',
				},
			],
			title: 'Comeback',
		},
	},

	vue: {
		compilerOptions: {
			isCustomElement: (tag) => ['swiper-container', 'swiper-slide'].includes(tag),
		},
	},

	image: {
		domains: ['lh3.googleusercontent.com', 'i.ibb.co'],
		format: ['webp', 'jpg', 'jpeg', 'png'],
		provider: 'none',
		screens: {
			xs: 320,
			sm: 640,
			md: 768,
			lg: 1024,
			xl: 1280,
			xxl: 1536,
		},
	},

	algolia: {
		apiKey: process.env.ALGOLIA_API_KEY,
		applicationId: process.env.ALGOLIA_APPLICATION_ID,
		lite: true,
		instantSearch: {
			theme: 'algolia',
		},
	},

	pwa: {
		registerType: 'autoUpdate',
		// Désactiver PWA en production pour éviter les erreurs
		disable: process.env.NODE_ENV === 'production',
		manifest: {
			name: 'Comeback',
			short_name: 'Comeback',
			description:
				'Ne manquez aucun Comeback. Suivez chaque prochaine sortie de vos artistes préférés.',
			theme_color: '#9E0102',
			background_color: '#ffffff',
			display: 'standalone',
			scope: '/',
			start_url: '/',
			icons: [
				{
					src: '/icons/icon-48x48.png',
					sizes: '48x48',
					type: 'image/png',
				},
				{
					src: '/icons/icon-72x72.png',
					sizes: '72x72',
					type: 'image/png',
				},
				{
					src: '/icons/icon-96x96.png',
					sizes: '96x96',
					type: 'image/png',
				},
				{
					src: '/icons/icon-144x144.png',
					sizes: '144x144',
					type: 'image/png',
				},
				{
					src: '/icons/icon-192x192.png',
					sizes: '192x192',
					type: 'image/png',
					purpose: 'any',
				},
				{
					src: '/icons/icon-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'maskable',
				},
			],
		},
		workbox: {
			navigateFallback: '/',
			globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
			// Ajouter une configuration plus robuste
			runtimeCaching: [
				{
					urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
					handler: 'CacheFirst',
					options: {
						cacheName: 'google-fonts-cache',
						expiration: {
							maxEntries: 10,
							maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
						},
						cacheableResponse: {
							statuses: [0, 200],
						},
					},
				},
			],
		},
		devOptions: {
			enabled: true,
			type: 'module',
		},
	},
})
