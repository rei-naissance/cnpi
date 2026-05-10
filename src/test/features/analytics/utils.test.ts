import { describe, it, expect } from 'vitest'
import { aggregateByCity, aggregateByDevice } from '@/features/analytics/utils'
import type { Click } from '@/types'

const makeClick = (overrides: Partial<Click> = {}): Click => ({
  id: 1,
  created_at: '2024-01-01',
  url_id: 1,
  city: 'London',
  country: 'GB',
  device: 'desktop',
  ...overrides,
})

describe('aggregateByCity', () => {
  it('counts cities and sorts descending', () => {
    const clicks = [
      makeClick({ city: 'London' }),
      makeClick({ city: 'London' }),
      makeClick({ city: 'Paris' }),
    ]
    const result = aggregateByCity(clicks)
    expect(result[0]).toEqual({ name: 'London', count: 2 })
    expect(result[1]).toEqual({ name: 'Paris', count: 1 })
  })

  it('maps null cities to Unknown', () => {
    const clicks = [makeClick({ city: null })]
    const result = aggregateByCity(clicks)
    expect(result[0].name).toBe('Unknown')
  })

  it('caps at 10 entries', () => {
    const clicks = Array.from({ length: 15 }, (_, i) =>
      makeClick({ city: `City${i}` })
    )
    expect(aggregateByCity(clicks).length).toBe(10)
  })
})

describe('aggregateByDevice', () => {
  it('capitalizes device names', () => {
    const clicks = [makeClick({ device: 'mobile' }), makeClick({ device: 'mobile' })]
    const result = aggregateByDevice(clicks)
    expect(result[0].name).toBe('Mobile')
    expect(result[0].value).toBe(2)
  })

  it('maps null device to Unknown', () => {
    const clicks = [makeClick({ device: null })]
    const result = aggregateByDevice(clicks)
    expect(result[0].name).toBe('Unknown')
  })

  it('calculates percent correctly', () => {
    const clicks = [
      makeClick({ device: 'desktop' }),
      makeClick({ device: 'desktop' }),
      makeClick({ device: 'mobile' }),
    ]
    const result = aggregateByDevice(clicks)
    const desktop = result.find((r) => r.name === 'Desktop')
    expect(desktop?.percent).toBe('66.7%')
  })
})
