import { describe, expect, it } from 'vitest'

import { buildHeatmapColumns } from './heatmap'

describe('buildHeatmapColumns', () => {
  it('maps activity entries into weekly columns', () => {
    const columns = buildHeatmapColumns([
      { date: new Date().toISOString().slice(0, 10), solvedCount: 3 },
    ])

    expect(columns.length).toBeGreaterThan(50)
    expect(columns.flat().some((cell) => cell.count === 3)).toBe(true)
  })
})
