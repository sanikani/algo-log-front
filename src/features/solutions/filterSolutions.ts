import type { Solution } from '../../types/api'

export function filterSolutions(solutions: Solution[], keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase()

  if (!normalizedKeyword) {
    return solutions
  }

  return solutions.filter((solution) => {
    const searchSource = [
      solution.problem.title,
      solution.problem.platform,
      solution.problem.difficulty,
      solution.problem.externalProblemId,
    ]
      .join(' ')
      .toLowerCase()

    return searchSource.includes(normalizedKeyword)
  })
}
