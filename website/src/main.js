import './styles/main.css'
import { i18n, applyTranslations } from './i18n.js'
import { initTheme, toggleTheme, currentTheme } from './theme.js'
import { renderHeader } from './components/header.js'
import { renderMain } from './components/main-content.js'
import { renderFooter } from './components/footer.js'
import { renderCardGrid, initCardGrid, applyCardFilters } from './components/card-grid.js'
import { fetchData } from './utils/data-loader.js'
import { createModal, showAnchorDetails } from './components/anchor-modal.js'
import { buildSearchIndex } from './utils/search-index.js'
import { initRouter, addRoute } from './utils/router.js'
import { renderDocPage, loadDocContent } from './components/doc-page.js'

const APP_VERSION = '0.4.0'

let appData = null

function initApp() {
  i18n.init()
  initTheme()

  // Initialize anchor modal
  createModal()

  // Setup routes
  addRoute('/', renderHomePage)
  addRoute('/about', renderAboutPage)
  addRoute('/contributing', renderContributingPage)

  // Load initial app structure
  const app = document.querySelector('#app')
  app.innerHTML = `
    ${renderHeader()}
    <div id="page-content"></div>
    ${renderFooter(APP_VERSION)}
  `

  // Initialize i18n and theme
  applyTranslations()
  updateThemeIcon()
  bindThemeToggle()
  bindLanguageToggle()
  updateActiveNavLink()

  // Initialize router
  initRouter()

  // Load data once for the app
  fetchData().then(data => {
    appData = data
  }).catch(err => {
    console.error('Failed to load app data:', err)
  })
}

function renderHomePage() {
  const pageContent = document.getElementById('page-content')
  if (!pageContent) return

  pageContent.innerHTML = renderMain()
  updateActiveNavLink()

  // Bind anchor selection
  bindAnchorSelection()

  // Initialize card grid
  if (appData) {
    initCardGridVisualization()
  } else {
    // If data not loaded yet, wait for it
    fetchData().then(data => {
      appData = data
      initCardGridVisualization()
    })
  }
}

function renderAboutPage() {
  const pageContent = document.getElementById('page-content')
  if (!pageContent) return

  pageContent.innerHTML = renderDocPage('About')
  updateActiveNavLink()
  loadDocContent('docs/about.adoc')
}

function renderContributingPage() {
  const pageContent = document.getElementById('page-content')
  if (!pageContent) return

  pageContent.innerHTML = renderDocPage('Contributing')
  updateActiveNavLink()
  loadDocContent('CONTRIBUTING.adoc')
}

function updateActiveNavLink() {
  const currentRoute = window.location.hash.slice(1) || '/'
  document.querySelectorAll('.nav-link').forEach(link => {
    const route = link.dataset.route
    if (route === currentRoute) {
      link.classList.add('font-semibold', 'text-[var(--color-text)]')
      link.classList.remove('text-[var(--color-text-secondary)]')
    } else {
      link.classList.remove('font-semibold', 'text-[var(--color-text)]')
      link.classList.add('text-[var(--color-text-secondary)]')
    }
  })
}

function bindAnchorSelection() {
  // Remove existing listener if any
  document.removeEventListener('anchor-selected', handleAnchorSelection)
  // Add listener
  document.addEventListener('anchor-selected', handleAnchorSelection)
}

function handleAnchorSelection(event) {
  const { anchorId } = event.detail
  showAnchorDetails(anchorId)
}

async function initCardGridVisualization() {
  try {
    const data = await fetchData()

    // Render card grid
    const container = document.getElementById('main-content')
    if (container) {
      container.innerHTML = renderCardGrid(data.categories, data.anchors)
    }

    // Initialize card event handlers
    initCardGrid()

    // Build search index in background
    buildSearchIndex(data.anchors).then(() => {
      console.log('✓ Full-text search ready')
      // Show indicator that search is ready
      const searchInput = document.getElementById('search-input')
      if (searchInput) {
        searchInput.placeholder = i18n.t('search.placeholder') + ' (full-text)'
      }
    }).catch(err => {
      console.warn('Search index build failed:', err)
    })

    // Bind role filter
    const roleFilter = document.getElementById('role-filter')
    if (roleFilter && data.roles) {
      data.roles.forEach(role => {
        const option = document.createElement('option')
        option.value = role.id
        option.textContent = role.name
        roleFilter.appendChild(option)
      })

      roleFilter.addEventListener('change', (e) => {
        const searchQuery = document.getElementById('search-input')?.value || ''
        applyCardFilters(e.target.value, searchQuery)
      })
    }

    // Bind search input
    const searchInput = document.getElementById('search-input')
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const roleId = document.getElementById('role-filter')?.value || ''
        applyCardFilters(roleId, e.target.value)
      })
    }
  } catch (err) {
    console.error('Failed to initialize card grid:', err)
    const container = document.getElementById('main-content')
    if (container) {
      container.innerHTML = '<div class="text-red-500 p-8">Failed to load anchors. Please try again later.</div>'
    }
  }
}

function bindThemeToggle() {
  const toggle = document.querySelector('#theme-toggle')
  if (!toggle) return

  toggle.addEventListener('click', () => {
    toggleTheme()
    updateThemeIcon()
  })
}

function updateThemeIcon() {
  const moonIcon = document.querySelector('#theme-icon-moon')
  const sunIcon = document.querySelector('#theme-icon-sun')
  const toggle = document.querySelector('#theme-toggle')
  if (!moonIcon || !sunIcon || !toggle) return

  const isDark = currentTheme() === 'dark'
  moonIcon.classList.toggle('hidden', isDark)
  sunIcon.classList.toggle('hidden', !isDark)

  const ariaKey = isDark ? 'header.themeToggle.light' : 'header.themeToggle.dark'
  toggle.setAttribute('aria-label', i18n.t(ariaKey))
  toggle.dataset.i18nAria = ariaKey
}

function bindLanguageToggle() {
  const toggle = document.querySelector('#lang-toggle')
  if (!toggle) return

  toggle.addEventListener('click', () => {
    i18n.toggleLang()
    toggle.textContent = i18n.currentLang() === 'en' ? 'DE' : 'EN'
    applyTranslations()
    updateThemeIcon()
  })
}

document.addEventListener('DOMContentLoaded', initApp)
