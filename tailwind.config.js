/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./app.vue",
		"./error.vue",
	],
	theme: {
		extend: {
			maxWidth: {
				'container': '85rem',
			},
			colors: {
				'theme-blue': '#007aff',
				'theme-blue-active': '#0270E9',
			},
		},
	},
	plugins: [],
}

