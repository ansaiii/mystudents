// 获取指定日期所在周的起始日期（从周一开始）
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

// 获取指定日期所在周的结束日期（到周日）
export const getWeekEnd = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() + (day === 0 ? 0 : 7 - day)
  return new Date(d.setDate(diff))
}

// 格式化日期为 YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// 格式化单个日期为展示格式 YYYY.M.D
export const formatDisplayDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}.${month}.${day}`
}

// 无年份的格式化日期为展示格式 M.D
export const formatDisplayDateWithoutYear = (date: Date): string => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}.${day}`
}

// 格式化日期范围为展示格式 YYYY.M.D-YYYY.M.D
export const formatDisplayDateRange = (start: Date, end: Date): string => {
  return `${formatDisplayDate(start)}-${formatDisplayDate(end)}`
}

// 获取两个日期之间的日期数组
export const getDatesBetween = (start: Date, end: Date): Date[] => {
  const dates: Date[] = []
  const current = new Date(start)

  while (current <= end) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
} 