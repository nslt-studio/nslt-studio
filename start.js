import { createServer } from 'vite'
import { Tunnel } from 'cloudflared'

async function start() {
  const server = await createServer({ configFile: './vite.config.js' })
  await server.listen()
  const port = server.config.server.port || 5173

  const t = Tunnel.quick(`http://localhost:${port}`)

  const publicUrl = await new Promise((resolve) => {
    t.once('url', resolve)
  })

  console.log(`\n  Script Webflow → ${publicUrl}/main.js\n`)
}

start()
