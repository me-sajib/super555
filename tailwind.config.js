/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				transparent: "transparent",
				primary: "#ed5311",
				current: "currentColor",
				appBlue: "#1141C1",
				bermuda: "#78dcca",
				headerColor: "#181818",
			},
		},
	},
	plugins: [],
};
