import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildTreemapOptions, getThemeColors } from './treemap.js'

const mockTreemapData = [
  {
    name: 'Testing & Quality',
    children: [
      { id: 'tdd-london-school', name: 'TDD, London School', value: 1, roles: ['software-developer'] },
      { id: 'tdd-chicago-school', name: 'TDD, Chicago School', value: 1, roles: ['software-developer'] }
    ]
  },
  {
    name: 'Architecture & Design',
    children: [
      { id: 'clean-architecture', name: 'Clean Architecture', value: 1, roles: ['software-architect'] }
    ]
  }
]

describe('getThemeColors', () => {
  it('should return light theme colors when dark mode is off', () => {
    const colors = getThemeColors(false)

    expect(colors.textColor).toBeDefined()
    expect(colors.bgColor).toBeDefined()
    expect(colors.borderColor).toBeDefined()
    expect(typeof colors.textColor).toBe('string')
  })

  it('should return dark theme colors when dark mode is on', () => {
    const colors = getThemeColors(true)

    expect(colors.textColor).toBeDefined()
    expect(colors.bgColor).toBeDefined()
  })

  it('should return different colors for light and dark modes', () => {
    const light = getThemeColors(false)
    const dark = getThemeColors(true)

    expect(light.textColor).not.toBe(dark.textColor)
    expect(light.bgColor).not.toBe(dark.bgColor)
  })
})

describe('buildTreemapOptions', () => {
  it('should return a valid ECharts option object', () => {
    const options = buildTreemapOptions(mockTreemapData, false)

    expect(options).toBeDefined()
    expect(options.series).toBeDefined()
    expect(options.series).toHaveLength(1)
    expect(options.series[0].type).toBe('treemap')
  })

  it('should include tooltip configuration', () => {
    const options = buildTreemapOptions(mockTreemapData, false)

    expect(options.tooltip).toBeDefined()
    expect(options.tooltip.show).toBe(true)
  })

  it('should set treemap data from input', () => {
    const options = buildTreemapOptions(mockTreemapData, false)

    expect(options.series[0].data).toEqual(mockTreemapData)
  })

  it('should configure breadcrumb for navigation', () => {
    const options = buildTreemapOptions(mockTreemapData, false)

    const series = options.series[0]
    expect(series.breadcrumb).toBeDefined()
    expect(series.breadcrumb.show).toBe(true)
  })

  it('should configure responsive roam behavior', () => {
    const options = buildTreemapOptions(mockTreemapData, false)

    const series = options.series[0]
    expect(series.roam).toBe(false)
  })

  it('should use dark theme colors when isDark is true', () => {
    const lightOptions = buildTreemapOptions(mockTreemapData, false)
    const darkOptions = buildTreemapOptions(mockTreemapData, true)

    const lightBreadcrumb = lightOptions.series[0].breadcrumb
    const darkBreadcrumb = darkOptions.series[0].breadcrumb

    expect(lightBreadcrumb.itemStyle.color).not.toBe(darkBreadcrumb.itemStyle.color)
  })

  it('should handle empty data', () => {
    const options = buildTreemapOptions([], false)

    expect(options.series[0].data).toEqual([])
  })

  it('should configure drill-down levels', () => {
    const options = buildTreemapOptions(mockTreemapData, false)

    const series = options.series[0]
    expect(series.levels).toBeDefined()
    expect(series.levels.length).toBeGreaterThanOrEqual(2)
  })
})
