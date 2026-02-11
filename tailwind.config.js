/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                'header-dark': '#1a1a2e',
                'header-mid': '#16213e',
                'nav-bg': '#2a2a3e',
                'nav-tab': '#3a3a55',
                'sidebar-bg': '#2d2d44',
                'sidebar-btn': '#3d3d58',
                'sidebar-btn-hover': '#4d4d68',
                'content-bg': '#ffffff',
                'content-border': '#555555',
                'frame-outer': '#888888',
                'frame-inner': '#aaaaaa',
                'gold-accent': '#c9a84c',
            },
            fontFamily: {
                arabic: ['Noto Kufi Arabic', 'Arial', 'sans-serif'],
                serif: ['Merriweather', 'serif'],
            },
        },
    },
    plugins: [],
}
