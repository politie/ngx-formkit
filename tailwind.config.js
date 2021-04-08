module.exports = {
  purge: {
    content: [
      "./projects/showcase/src/**/*.html",
      "./projects/showcase/src/**/*.ts"
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
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ]
}
