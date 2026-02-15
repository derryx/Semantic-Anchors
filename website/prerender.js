/**
 * Prerender script using Playwright
 * Generates static HTML for all routes to improve SEO
 */

import { chromium } from '@playwright/test'
import { generateRoutes } from './prerender-routes.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'http://localhost:4173' // Vite preview server
const DIST_DIR = path.join(__dirname, 'dist')

async function prerenderRoutes() {
  console.log('🎭 Starting prerender with Playwright...\n')

  const routes = generateRoutes()
  console.log(`📄 Prerendering ${routes.length} routes\n`)

  // Launch browser
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  let successCount = 0
  let errorCount = 0

  for (const route of routes) {
    try {
      const url = `${BASE_URL}/#${route}`
      console.log(`   Rendering: ${route}`)

      // Navigate to route
      await page.goto(url, { waitUntil: 'networkidle' })

      // Wait for app-ready event
      await page.evaluate(() => {
        return new Promise((resolve) => {
          const timeout = setTimeout(() => resolve(), 5000) // Fallback timeout
          document.addEventListener('app-ready', () => {
            clearTimeout(timeout)
            resolve()
          }, { once: true })
        })
      })

      // Get rendered HTML
      const html = await page.content()

      // Determine output path
      let outputPath
      if (route === '/') {
        outputPath = path.join(DIST_DIR, 'index.html')
      } else {
        // Create nested directory structure (e.g., /anchor/tdd -> dist/anchor/tdd/index.html)
        const routePath = route.startsWith('/') ? route.slice(1) : route
        const dirPath = path.join(DIST_DIR, routePath)
        fs.mkdirSync(dirPath, { recursive: true })
        outputPath = path.join(dirPath, 'index.html')
      }

      // Write HTML to file
      fs.writeFileSync(outputPath, html, 'utf-8')

      successCount++
    } catch (error) {
      console.error(`   ❌ Failed to render ${route}:`, error.message)
      errorCount++
    }
  }

  await browser.close()

  console.log(`\n✅ Prerender complete!`)
  console.log(`   Success: ${successCount} routes`)
  if (errorCount > 0) {
    console.log(`   Errors: ${errorCount} routes`)
  }
  console.log(`   Output: ${DIST_DIR}\n`)

  if (errorCount > 0) {
    process.exit(1)
  }
}

prerenderRoutes().catch((error) => {
  console.error('❌ Prerender failed:', error)
  process.exit(1)
})
