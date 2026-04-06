import { describe, expect, it } from 'vitest'

import { filterSolutions } from './filterSolutions'

describe('filterSolutions', () => {
  it('filters by title and difficulty', () => {
    const results = filterSolutions(
      [
        {
          id: 1,
          code: '',
          timeElapsed: 100,
          solved: true,
          memoMarkdown: '',
          memberId: 1,
          createdAt: '2026-04-06T00:00:00',
          updatedAt: '2026-04-06T00:00:00',
          problem: {
            id: 1,
            platform: 'BAEKJOON',
            externalProblemId: '1000',
            title: 'A+B',
            problemUrl: 'https://example.com',
            difficulty: 'Bronze',
          },
        },
      ],
      'bronze',
    )

    expect(results).toHaveLength(1)
  })
})
