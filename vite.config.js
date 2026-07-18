import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import geminiHandler from './api/gemini.js'
import express from 'express'

// Simulate Vercel serverless function environment locally
const vercelApiPlugin = () => ({
  name: 'vercel-api-plugin',
  configureServer(server) {
    const app = express()
    app.use(express.json())
    
    app.all('/api/gemini', async (req, res) => {
      try {
        await geminiHandler(req, res)
      } catch (err) {
        console.error('API Error:', err)
        if (!res.headersSent) res.status(500).json({ error: err.message })
      }
    })
    
    server.middlewares.use(app)
  }
})

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env }
  
  return {
    plugins: [react(), vercelApiPlugin()],
  }
})
