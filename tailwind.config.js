const mode = process.env.TAILWIND_MODE === 'watch' ? 'jit' : 'aot';

module.exports = {
  mode: mode,
  purge: [
    './projects/**/*.{html,ts}',
    './src/safelist.txt'
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ]
}
