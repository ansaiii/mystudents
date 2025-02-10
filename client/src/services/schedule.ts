import Taro from '@tarojs/taro'
import { Lesson, LessonStatus } from '../types/schedule'

class ScheduleService {
  private readonly STORAGE_KEY = 'SCHEDULES'

  // 获取指定周的课程
  async getWeekSchedule(weekStart: string): Promise<Lesson[]> {
    try {
      const { data } = await Taro.getStorage({ key: this.STORAGE_KEY })
      const weekEnd = this.addDays(weekStart, 6)
      return (data || []).filter((lesson: Lesson) => {
        const lessonDate = lesson.startTime.split('-').slice(0, 3).join('-')
        return lessonDate >= weekStart && lessonDate <= weekEnd
      })
    } catch (error) {
      console.error('获取周课表失败:', error)
      return []
    }
  }

  // 更新课程状态
  async updateLessonStatus(lessonId: string, status: LessonStatus): Promise<boolean> {
    try {
      const { data } = await Taro.getStorage({ key: this.STORAGE_KEY })
      const lessons = data || []
      const index = lessons.findIndex((l: Lesson) => l.id === lessonId)
      
      if (index === -1) return false

      lessons[index] = {
        ...lessons[index],
        status
      }

      await Taro.setStorage({
        key: this.STORAGE_KEY,
        data: lessons
      })

      return true
    } catch (error) {
      console.error('更新课程状态失败:', error)
      return false
    }
  }

  // 添加新课程
  async addLesson(lesson: Omit<Lesson, 'id'>): Promise<Lesson> {
    try {
      const { data } = await Taro.getStorage({ key: this.STORAGE_KEY })
      const lessons = data || []
      const newLesson: Lesson = {
        id: `lesson_${Date.now()}`,
        ...lesson
      }

      lessons.push(newLesson)
      await Taro.setStorage({
        key: this.STORAGE_KEY,
        data: lessons
      })

      return newLesson
    } catch (error) {
      console.error('添加课程失败:', error)
      throw new Error('添加课程失败')
    }
  }

  // 日期处理工具方法
  private addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr)
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }
}

export const scheduleService = new ScheduleService() 