import Taro from '@tarojs/taro'
import { Lesson, LessonStatus } from '../types/schedule'

class ScheduleService {
  private readonly STORAGE_KEY = 'SCHEDULES'

  // 获取指定周的课程
  async getWeekSchedule(weekStart: string, weekEnd: string): Promise<Lesson[]> {
    console.log('params======', weekStart, weekEnd);
    try {
      const { result } = await Taro.cloud.callFunction({
        name: 'getWeekSchedule',
        data: { weekStart, weekEnd }
      })

      if (result.code === 200) {
        return result.data || []
      }
      throw new Error(result.message || '获取课表失败')
    } catch (err) {
      Taro.showToast({
        title: '加载课表失败',
        icon: 'none'
      })
      return []
    }
  }


  // 更新课程状态
  async updateLessonStatus(lessonId: string, status: LessonStatus): Promise<boolean> {
    try {
      const { result } = await Taro.cloud.callFunction({
        name: 'updateLessonStatus',
        data: { lessonId, status }
      })

      if (result.code === 200) {
        return true
      }
      throw new Error(result.message || '更新课程状态失败')
    } catch (error) {
      console.error('更新课程状态失败:', error)
      return false
    }
  }

  // 添加新课程
  async addLesson(lesson: Omit<Lesson, 'id'>): Promise<Lesson> {
    try {
      const { result } = await Taro.cloud.callFunction({
        name: 'addLesson',
        data: { lesson }
      })
      console.log('result======', result);
      if (result.code === 200) {
        return result.data
      }
      throw new Error(result.message || '添加课程失败')
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