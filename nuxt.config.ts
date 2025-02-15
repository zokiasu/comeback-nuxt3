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

	ssr: true,

	nitro: {
		preset: 'netlify'
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
					crossorigin: true,
				},
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
				},
			],
			meta: [{ name: 'theme-color', content: '#9E0102' }],
		},
	},

	vue: {
		compilerOptions: {
			isCustomElement: (tag) => ['swiper-container', 'swiper-slide'].includes(tag),
		},
	},

	image: {
		domains: ['lh3.googleusercontent.com', 'i.ibb.co'],
		alias: {
			google: 'lh3.googleusercontent.com',
			ibb: 'i.ibb.co',
		},
	},

	algolia: {
		apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
		applicationId: process.env.ALGOLIA_APPLICATION_ID,
		lite: true,
		recommend: true,
	},

	tailwindcss: {
		configPath: 'tailwind.config.js',
		cssPath: '~/assets/css/tailwind.css',
		injectPosition: 'first',
	},

	compatibilityDate: '2025-02-09',
})
