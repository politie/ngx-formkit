module.exports = {
  purge: {
    content: [
      "./src/**/*.html",
      "./src/**/*.ts"
    ],
    options: {
      safelist: [
        ':host',
        '::ng-deep'
      ]
    }
  },
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
  plugins: []
}
