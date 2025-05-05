import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtFloatLayout } from 'taro-ui'
import PageContainer from '../../components/PageContainer'
import WeekSelector from '../../components/WeekSelector'
import { Lesson, LessonStatus } from '../../types/schedule'
import LessonCard from '../../components/LessonCard'
import { scheduleService } from '../../services/schedule'
import { getWeekStart, getWeekEnd, formatDisplayDate, formatDate, getDatesBetween, formatDisplayDateRange, formatDisplayDateWithoutYear } from '../../utils/date'
import './index.scss'

// 更新时间段配置
const TIME_SLOTS = [
  { start: '08:00', end: '10:00', label: '8:00\n10:00' },
  { start: '10:20', end: '12:20', label: '10:20\n12:20' },
  { start: '12:40', end: '14:40', label: '12:40\n14:40' },
  { start: '15:00', end: '17:00', label: '15:00\n17:00' },
  { start: '17:20', end: '19:20', label: '17:20\n19:20' },
  { start: '19:40', end: '21:40', label: '19:40\n21:40' }
]

const TIME_SLOT_LABELS = {
  '08:00-10:00': '上午第一节',
  '10:20-12:20': '上午第二节',
  '12:40-14:40': '下午第一节',
  '15:00-17:00': '下午第二节',
  '17:20-19:20': '晚上第一节',
  '19:40-21:40': '晚上第二节'
}

// 更新星期显示
const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const ParentPage = () => {
  const [weekStart, setWeekStart] = useState(new Date())
  const [weekEnd, setWeekEnd] = useState(new Date())
  const [weekDates, setWeekDates] = useState<Date[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isOpened, setIsOpened] = useState(false)
  const [loading, setLoading] = useState(false)

  // 加载周课表
  const loadWeekSchedule = async () => {
    setLoading(true)
    try {
      const { result } = await Taro.cloud.callFunction({
        name: 'getStudentSchedule',
        data: {
          startDate: formatDate(weekStart),
          endDate: formatDate(weekEnd)
        }
      })
      setLessons(result || [])
    } catch (error) {
      console.error('加载课表失败:', error)
      Taro.showToast({
        title: '加载课表失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 处理上一周
  const handlePrevWeek = () => {
    const newWeekStart = new Date(weekStart)
    newWeekStart.setDate(newWeekStart.getDate() - 7)
    setWeekStart(newWeekStart)
    setWeekEnd(new Date(newWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000))
  }

  // 处理下一周
  const handleNextWeek = () => {
    const newWeekStart = new Date(weekStart)
    newWeekStart.setDate(newWeekStart.getDate() + 7)
    setWeekStart(newWeekStart)
    setWeekEnd(new Date(newWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000))
  }

  // 处理课程点击
  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setIsOpened(true)
  }

  // 初始化
  useEffect(() => {
    const start = getWeekStart(new Date())
    const end = getWeekEnd(start)
    setWeekStart(start)
    setWeekEnd(end)
    setWeekDates(getDatesBetween(start, end))
  }, [])

  // 加载课表
  useEffect(() => {
    loadWeekSchedule()
  }, [weekStart])

  return (
    <PageContainer className='schedule'>
      <View className='header'>
        <WeekSelector
          weekStart={formatDisplayDateRange(weekStart, weekEnd)}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
      </View>

      <View className='schedule-content'>
        <View className='schedule-grid'>
          <View className='time-column'>
            <View className='header-cell' />
            {TIME_SLOTS.map(slot => (
              <View key={slot.start} className='time-cell'>
                <Text>{slot.label}</Text>
              </View>
            ))}
          </View>

          {weekDates.map(date => (
            <View key={formatDate(date)} className='day-column'>
              <View className='header-cell'>
                <Text>{WEEKDAYS[date.getDay() === 0 ? 6 : date.getDay() - 1]}</Text>
                <Text className='date'>{formatDisplayDateWithoutYear(date)}</Text>
              </View>
              {TIME_SLOTS.map(timeSlot => {
                const lesson = lessons.find(l =>
                  l.startTime === `${formatDate(date)}-${timeSlot.start}`
                )
                return (
                  <View
                    key={timeSlot.start}
                    className={`schedule-cell ${lesson ? 'has-lesson' : ''}`}
                  >
                    {lesson && (
                      <LessonCard
                        lesson={lesson}
                        onClick={() => handleLessonClick(lesson)}
                      />
                    )}
                  </View>
                )
              })}
            </View>
          ))}
        </View>
      </View>

      <AtFloatLayout
        isOpened={isOpened}
        title={`${selectedLesson?.studentName || ''} - ${selectedLesson?.subject || ''}`}
        onClose={() => setIsOpened(false)}
      >
        <View className='lesson-detail'>
          <View className='detail-item'>
            <Text className='label'>学生：</Text>
            <Text className='value'>{selectedLesson?.studentName}</Text>
          </View>
          <View className='detail-item'>
            <Text className='label'>科目：</Text>
            <Text className='value'>{selectedLesson?.subject}</Text>
          </View>
          <View className='detail-item'>
            <Text className='label'>时间：</Text>
            <Text className='value'>{selectedLesson?.startTime}</Text>
          </View>
          <View className='detail-item'>
            <Text className='label'>状态：</Text>
            <Text className='value'>{selectedLesson?.status}</Text>
          </View>
        </View>
      </AtFloatLayout>
    </PageContainer>
  )
}

export default ParentPage 