import { describe, it, expect } from 'vitest'
import { buildTreemapData, getAnchorsByRole, getCategoryColor } from './data-loader.js'

const mockCategories = [
  {
    id: 'testing-quality',
    name: 'Testing & Quality',
    anchors: ['tdd-london-school', 'tdd-chicago-school', 'mutation-testing']
  },
  {
    id: 'architecture-design',
    name: 'Architecture & Design',
    anchors: ['clean-architecture', 'hexagonal-architecture']
  }
]

const mockAnchors = [
  { id: 'tdd-london-school', title: 'TDD, London School', categories: ['testing-quality'], roles: ['software-developer', 'qa-engineer'] },
  { id: 'tdd-chicago-school', title: 'TDD, Chicago School', categories: ['testing-quality'], roles: ['software-developer', 'qa-engineer'] },
  { id: 'mutation-testing', title: 'Mutation Testing', categories: ['testing-quality'], roles: ['software-developer', 'qa-engineer'] },
  { id: 'clean-architecture', title: 'Clean Architecture', categories: ['architecture-design'], roles: ['software-architect', 'software-developer'] },
  { id: 'hexagonal-architecture', title: 'Hexagonal Architecture', categories: ['architecture-design'], roles: ['software-architect', 'software-developer'] }
]

const mockRoles = [
  { id: 'software-developer', name: 'Software Developer / Engineer', anchors: ['tdd-london-school', 'tdd-chicago-school', 'mutation-testing', 'clean-architecture', 'hexagonal-architecture'] },
  { id: 'qa-engineer', name: 'QA Engineer / Tester', anchors: ['tdd-london-school', 'tdd-chicago-school', 'mutation-testing'] },
  { id: 'software-architect', name: 'Software Architect', anchors: ['clean-architecture', 'hexagonal-architecture'] }
]

describe('buildTreemapData', () => {
  it('should create treemap data grouped by categories', () => {
    const result = buildTreemapData(mockCategories, mockAnchors)

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Testing & Quality')
    expect(result[0].children).toHaveLength(3)
    expect(result[1].name).toBe('Architecture & Design')
    expect(result[1].children).toHaveLength(2)
  })

  it('should set value to 1 for each anchor leaf node', () => {
    const result = buildTreemapData(mockCategories, mockAnchors)

    const firstChild = result[0].children[0]
    expect(firstChild.value).toBe(1)
    expect(firstChild.id).toBeDefined()
    expect(firstChild.name).toBeDefined()
  })

  it('should include anchor metadata in leaf nodes', () => {
    const result = buildTreemapData(mockCategories, mockAnchors)

    const tddLondon = result[0].children.find(c => c.id === 'tdd-london-school')
    expect(tddLondon).toBeDefined()
    expect(tddLondon.name).toBe('TDD, London School')
    expect(tddLondon.roles).toEqual(['software-developer', 'qa-engineer'])
  })

  it('should handle empty categories gracefully', () => {
    const emptyCategories = [{ id: 'empty', name: 'Empty', anchors: [] }]
    const result = buildTreemapData(emptyCategories, mockAnchors)

    expect(result).toHaveLength(1)
    expect(result[0].children).toHaveLength(0)
  })

  it('should handle missing anchors in categories', () => {
    const categories = [{ id: 'test', name: 'Test', anchors: ['nonexistent'] }]
    const result = buildTreemapData(categories, mockAnchors)

    expect(result[0].children).toHaveLength(0)
  })
})

describe('getAnchorsByRole', () => {
  it('should filter anchors by role', () => {
    const result = getAnchorsByRole(mockAnchors, 'qa-engineer')

    expect(result).toHaveLength(3)
    expect(result.every(a => a.roles.includes('qa-engineer'))).toBe(true)
  })

  it('should return all anchors when no role specified', () => {
    const result = getAnchorsByRole(mockAnchors, '')

    expect(result).toHaveLength(5)
  })

  it('should return empty array for unknown role', () => {
    const result = getAnchorsByRole(mockAnchors, 'unknown-role')

    expect(result).toHaveLength(0)
  })
})

describe('getCategoryColor', () => {
  it('should return a consistent color for the same index', () => {
    const color1 = getCategoryColor(0)
    const color2 = getCategoryColor(0)

    expect(color1).toBe(color2)
  })

  it('should return different colors for different indices', () => {
    const color1 = getCategoryColor(0)
    const color2 = getCategoryColor(1)

    expect(color1).not.toBe(color2)
  })

  it('should wrap around for indices beyond palette length', () => {
    const color = getCategoryColor(100)
    expect(color).toBeDefined()
    expect(color).toMatch(/^#[0-9a-fA-F]{6}$/)
  })
})
