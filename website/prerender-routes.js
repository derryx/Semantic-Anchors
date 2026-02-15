/**
 * Generate routes for prerendering
 * Reads anchors.json and creates route list for static generation
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function generateRoutes() {
  const anchorsPath = path.join(__dirname, 'public', 'data', 'anchors.json')

  if (!fs.existsSync(anchorsPath)) {
    console.warn('⚠️  anchors.json not found - prerendering static pages only')
    return [
      '/',
      '/about',
      '/contributing'
    ]
  }

  const anchors = JSON.parse(fs.readFileSync(anchorsPath, 'utf-8'))

  const routes = [
    '/',
    '/about',
    '/contributing',
    ...anchors.map(anchor => `/anchor/${anchor.id}`)
  ]

  console.log(`✓ Generated ${routes.length} routes for prerendering (3 pages + ${anchors.length} anchors)`)

  return routes
}

export { generateRoutes }
