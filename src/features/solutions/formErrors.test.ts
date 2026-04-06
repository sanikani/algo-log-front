import { describe, expect, it } from 'vitest'

import { getFieldError } from './formErrors'

describe('getFieldError', () => {
  it('returns the matching reason for a field', () => {
    const error = getFieldError(
      [{ field: 'problem.title', reason: 'must not be blank', rejectedValue: '' }],
      'problem.title',
    )

    expect(error).toBe('must not be blank')
  })
})
