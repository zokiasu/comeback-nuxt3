// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
		},
	},

	plugins: [
		'~/plugins/firebase.client.ts',
		'~/plugins/toast.js',
		'~/plugins/VueDatePicker.js',
		'~/plugins/vueModal.js',
	],

	modules: [
		'@nuxtjs/tailwindcss',
		'@nuxt/image',
		'@pinia/nuxt',
		'pinia-plugin-persistedstate/nuxt',
		'@nuxtjs/algolia',
	],

	algolia: {
		applicationId: process.env.ALGOLIA_APPLICATION_ID,
		apiKey: process.env.ALGOLIA_API_KEY,
		useFetch: true,
		instantSearch: true,
		recommend: true,
	},

	devtools: {
		enabled: true,
	},

	build: {
		// vue-toastification - old commonjs module
		transpile: ['vue-toastification', '@vuepic/vue-datepicker', 'swiper'],
	},

	vue: {
		compilerOptions: {
			isCustomElement: (tag) => ['swiper-container', 'swiper-slide'].includes(tag),
		},
	},

	tailwindcss: {
		configPath: 'tailwind.config.js',
		exposeConfig: false,
		viewer: true,
	},

	image: {
		provider: 'ipx',
		domains: [],
		presets: {
			cover: {
				modifiers: {
					format: 'webp',
					quality: '80',
				},
			},
		},
	},

	app: {
		head: {
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{ rel: 'icon', type: 'image/png', sizes: '48x48', href: '/icons/icon-48x48.png' },
				{ rel: 'icon', type: 'image/png', sizes: '72x72', href: '/icons/icon-72x72.png' },
				{ rel: 'icon', type: 'image/png', sizes: '96x96', href: '/icons/icon-96x96.png' },
				{
					rel: 'icon',
					type: 'image/png',
					sizes: '144x144',
					href: '/icons/icon-144x144.png',
				},
				{
					rel: 'icon',
					type: 'image/png',
					sizes: '192x192',
					href: '/icons/icon-192x192.png',
				},
				{
					rel: 'icon',
					type: 'image/png',
					sizes: '512x512',
					href: '/icons/icon-512x512.png',
				},
			],
			meta: [{ name: 'theme-color', content: '#9E0102' }],
		},
	},

	compatibilityDate: '2025-02-09',
})
