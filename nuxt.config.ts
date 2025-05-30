// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	compatibilityDate: '2025-05-27',

	modules: [
		'@pinia/nuxt',
		'@nuxt/image',
		'@nuxtjs/algolia',
		'@nuxt/ui',
		'@nuxtjs/supabase',
		'@nuxt/eslint',
	],

	css: ['~/assets/css/tailwind.css'],

	ssr: false,

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
		cookieOptions: {
			secure: true,
			sameSite: 'lax'
		}
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
				{ 'http-equiv': 'Cross-Origin-Opener-Policy', content: 'same-origin-allow-popups' },
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
					content: 'https://come-back.netlify.app/ogp.png',
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
})
