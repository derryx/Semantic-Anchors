import './styles/main.css'
import { renderHeader } from './components/header.js'
import { renderMain } from './components/main-content.js'
import { renderFooter } from './components/footer.js'
import { initTreemap, updateTreemapByRole } from './components/treemap.js'

const APP_VERSION = '0.2.0'

function initApp() {
  const app = document.querySelector('#app')

  app.innerHTML = `
    ${renderHeader()}
    ${renderMain()}
    ${renderFooter(APP_VERSION)}
  `

  initThemeToggle()
  initLanguageToggle()
  initTreemapVisualization()
}

async function initTreemapVisualization() {
  try {
    const { currentData } = await initTreemap()

    const roleFilter = document.getElementById('role-filter')
    if (roleFilter && currentData.roles) {
      currentData.roles.forEach(role => {
        const option = document.createElement('option')
        option.value = role.id
        option.textContent = role.name
        roleFilter.appendChild(option)
      })

      roleFilter.addEventListener('change', (e) => {
        updateTreemapByRole(e.target.value)
      })
    }
  } catch (err) {
    console.error('Failed to initialize treemap:', err)
  }
}

function initThemeToggle() {
  const toggle = document.querySelector('#theme-toggle')
  if (!toggle) return

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }

  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark')
    const isDark = document.documentElement.classList.contains('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  })
}

function initLanguageToggle() {
  const toggle = document.querySelector('#lang-toggle')
  if (!toggle) return

  const savedLang = localStorage.getItem('lang') || 'en'
  document.documentElement.lang = savedLang
  toggle.textContent = savedLang === 'en' ? 'DE' : 'EN'

  toggle.addEventListener('click', () => {
    const currentLang = document.documentElement.lang
    const newLang = currentLang === 'en' ? 'de' : 'en'
    document.documentElement.lang = newLang
    localStorage.setItem('lang', newLang)
    toggle.textContent = newLang === 'en' ? 'DE' : 'EN'
  })
}

document.addEventListener('DOMContentLoaded', initApp)
