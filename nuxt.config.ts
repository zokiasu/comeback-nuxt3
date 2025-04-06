// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	modules: ['@pinia/nuxt', '@nuxt/image', '@nuxtjs/algolia', '@nuxt/ui'],

	css: ['~/assets/css/tailwind.css'],

	colorMode: {
		classSuffix: '',
	},

	devtools: { enabled: true },

	vite: {
		plugins: [tailwindcss()],
		build: {
			chunkSizeWarningLimit: 1600,
		},
	},

	ssr: true,

	nitro: {
		preset: 'netlify',
		static: true,
		output: {
			dir: './dist',
		},
	},

	runtimeConfig: {
		public: {
			FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
			FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
			FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
			FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
			FIREBASE_MESSAGIN_SENDER_ID: process.env.FIREBASE_MESSAGIN_SENDER_ID,
			FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
			FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
			FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
			YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
			ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
			ALGOLIA_APPLICATION_ID: process.env.ALGOLIA_APPLICATION_ID,
			ALGOLIA_INDEX_NAME: process.env.ALGOLIA_INDEX_NAME,
			supabaseUrl: process.env.SUPABASE_URL,
			supabaseKey: process.env.SUPABASE_KEY,
		},
	},

	plugins: ['~/plugins/firebase.client.ts'],

	experimental: {
		payloadExtraction: false,
	},

	typescript: {
		strict: true,
		typeCheck: false,
	},

	build: {
		transpile: ['firebase', 'swiper', 'vuedraggable', 'tslib'],
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

	compatibilityDate: '2025-04-03',
})
