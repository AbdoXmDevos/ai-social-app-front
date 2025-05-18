module.exports = {
    darkMode: 'class', // enable dark mode via a class
    theme: {
      extend: {
        colors: {
          background: '#0a0a0a', // almost black
          card: '#111111', // dark grey cards
          primary: '#00f0ff', // neon blue
          secondary: '#7e22ce', // purple
        },
        typography: {
          DEFAULT: {
            css: {
              color: '#fff',
              a: {
                color: '#00f0ff',
                '&:hover': {
                  color: '#7e22ce',
                },
              },
              h1: { color: '#fff' },
              h2: { color: '#fff' },
              h3: { color: '#fff' },
              h4: { color: '#fff' },
              h5: { color: '#fff' },
              h6: { color: '#fff' },
              strong: { color: '#fff' },
              code: { color: '#fff' },
              blockquote: {
                color: '#d1d5db',
                borderLeftColor: '#7e22ce',
              },
            },
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  }
