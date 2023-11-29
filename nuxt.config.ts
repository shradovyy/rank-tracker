// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
	devtools: { enabled: true },
	components: false,
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	runtimeConfig: {
		mongoDbUri: process.env.MONGO_DB_URI,
		mongoDbName: process.env.MONGO_DB_NAME,
	},
	modules: [
		'@pinia/nuxt'
	],
	css: ['~/assets/css/tailwind.css', '@fortawesome/fontawesome-svg-core/styles.css'],
	build: {
		transpile: [
			'@fortawesome/fontawesome-svg-core',
			'@fortawesome/vue-fontawesome',
			'@fortawesome/free-brands-svg-icons',
			'@fortawesome/free-solid-svg-icons',
		]
	},
	app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
			title: 'Rank Tracker by Stanislav Hradovyy - JSguy.dev',
			htmlAttrs: {
				lang: 'en'
			},
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'format-detection', content: 'telephone=no' },
				{ name: 'robots', content: 'all, index, follow' },
				{ name: 'revisit-after', content: '1 day' },
				{ name: 'msapplication-TileColor', content: '#ffffff' },
				{ name: 'theme-color', content: '#ffffff' },

				{ name: 'description', content: `Effortlessly track your website's search engine rankings with our user-friendly rank tracking tool. Accurate, real-time updates for SEO success.` },

				{ property: 'og:title', content: 'Rank Tracker by Stanislav Hradovyy - JSguy.dev' },
				{ property: 'og:description', content: `Effortlessly track your website's search engine rankings with our user-friendly rank tracking tool. Accurate, real-time updates for SEO success.` },
			],
			link: [
				{ rel: 'shortcut icon', href: '/favicon.ico' },
			]
		},
	},
})
