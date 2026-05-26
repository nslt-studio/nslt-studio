import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { spawn } from 'node:child_process'
import { Tunnel } from 'cloudflared'
import { fileURLToPath } from 'node:url'

const DIST = join(fileURLToPath(new URL('.', import.meta.url)), 'dist')
const PORT = 5173

const MIME = {
  '.js':  'application/javascript',
  '.css': 'text/css',
  '.map': 'application/json',
}

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  const filePath = join(DIST, req.url.split('?')[0])
  const ext = extname(filePath)

  if (existsSync(filePath)) {
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' })
    res.end(readFileSync(filePath))
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(PORT, async () => {
  const vite = spawn('npx', ['vite', 'build', '--watch'], {
    stdio: 'inherit',
    cwd: fileURLToPath(new URL('.', import.meta.url)),
  })
  vite.on('error', err => console.error('Vite error:', err))

  const t = Tunnel.quick(`http://localhost:${PORT}`)
  const publicUrl = await new Promise(resolve => t.once('url', resolve))
  console.log(`\n  Script Webflow → ${publicUrl}/main.js\n`)
})
