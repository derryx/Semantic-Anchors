/**
 * Build script for Static Site Generation
 * 1. Runs vite build
 * 2. Starts preview server
 * 3. Prerenders all routes
 * 4. Stops preview server
 */

import { spawn } from 'child_process'
import { setTimeout } from 'timers/promises'
import http from 'http'

const PREVIEW_PORT = 4173
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`

async function checkServerReady(maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(PREVIEW_URL, (res) => {
          if (res.statusCode === 200) {
            resolve()
          } else {
            reject(new Error(`Server returned ${res.statusCode}`))
          }
        })
        req.on('error', reject)
        req.setTimeout(1000, () => {
          req.destroy()
          reject(new Error('Timeout'))
        })
      })
      return true
    } catch (error) {
      if (i < maxRetries - 1) {
        await setTimeout(1000)
      }
    }
  }
  return false
}

async function buildSSG() {
  console.log('📦 Building website for SSG...\n')

  // Step 1: Run vite build
  console.log('1️⃣  Running vite build...')
  const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    shell: true
  })

  await new Promise((resolve, reject) => {
    buildProcess.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Build failed with code ${code}`))
      }
    })
  })

  console.log('✓ Build complete\n')

  // Step 2: Start preview server
  console.log('2️⃣  Starting preview server...')
  const previewProcess = spawn('npm', ['run', 'preview'], {
    stdio: 'pipe',
    shell: true
  })

  // Wait for server to be ready
  const serverReady = await checkServerReady()
  if (!serverReady) {
    previewProcess.kill()
    throw new Error('Preview server failed to start')
  }

  console.log(`✓ Preview server running on ${PREVIEW_URL}\n`)

  try {
    // Step 3: Run prerender
    console.log('3️⃣  Prerendering routes...\n')
    const prerenderProcess = spawn('node', ['prerender.js'], {
      stdio: 'inherit',
      shell: true
    })

    await new Promise((resolve, reject) => {
      prerenderProcess.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Prerender failed with code ${code}`))
        }
      })
    })

    console.log('\n✅ SSG build complete!\n')
  } finally {
    // Step 4: Stop preview server
    console.log('4️⃣  Stopping preview server...')
    previewProcess.kill()
    console.log('✓ Preview server stopped\n')
  }
}

buildSSG().catch((error) => {
  console.error('❌ SSG build failed:', error.message)
  process.exit(1)
})
