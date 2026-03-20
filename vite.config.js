import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry:    './main.js',
      formats:  ['es'],
      fileName: 'main',
    },
  },
  server: {
    port: 5173,
    allowedHosts: true,
  },
  plugins: [
    {
      name: 'force-cors',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
          next()
        })
      },
    },
  ],
})
