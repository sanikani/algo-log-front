import type { HeatmapDay } from '../../types/api'

export interface HeatmapCell {
  key: string
  label: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function toLevel(count: number, maxCount: number): HeatmapCell['level'] {
  if (count <= 0 || maxCount <= 0) {
    return 0
  }

  const ratio = count / maxCount

  if (ratio >= 0.75) {
    return 4
  }

  if (ratio >= 0.5) {
    return 3
  }

  if (ratio >= 0.25) {
    return 2
  }

  return 1
}

export function buildHeatmapColumns(entries: HeatmapDay[]) {
  const countMap = new Map(entries.map((entry) => [entry.date, entry.solvedCount]))
  const maxCount = entries.reduce((max, entry) => Math.max(max, entry.solvedCount), 0)
  const end = new Date()
  const start = new Date(end)
  start.setDate(end.getDate() - 364)

  const calendarStart = new Date(start)
  calendarStart.setDate(start.getDate() - start.getDay())

  const columns: HeatmapCell[][] = []
  const cursor = new Date(calendarStart)

  while (cursor <= end) {
    const column: HeatmapCell[] = []

    for (let index = 0; index < 7; index += 1) {
      const key = toDateKey(cursor)
      const count = countMap.get(key) ?? 0

      column.push({
        key,
        label: cursor.toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric',
        }),
        count,
        level: toLevel(count, maxCount),
      })

      cursor.setDate(cursor.getDate() + 1)
    }

    columns.push(column)
  }

  return columns
}
