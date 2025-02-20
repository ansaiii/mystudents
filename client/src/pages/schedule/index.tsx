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
import './index.less'
import React from 'react'

// 更新时间段配置
const TIME_SLOTS = [
  { start: '08:00', end: '10:00', label: '8:00\n10:00' },
  { start: '10:20', end: '12:20', label: '10:20\n12:20' },
  { start: '12:40', end: '14:40', label: '12:40\n14:40' },
  { start: '15:00', end: '17:00', label: '15:00\n17:00' },
  { start: '17:20', end: '19:20', label: '17:20\n19:20' },
  { start: '19:40', end: '21:40', label: '19:40\n21:40' }
]

// 更新星期显示
const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isOpened, setIsOpened] = useState(false)

  // 获取当前周的日期范围
  const weekStart = getWeekStart(currentDate)
  const weekEnd = getWeekEnd(currentDate)
  const weekDates = getDatesBetween(weekStart, weekEnd) // 移除周末过滤

  // 加载周课表数据
  useEffect(() => {
    loadWeekSchedule()
  }, [currentDate])

  const loadWeekSchedule = async () => {
    const weekLessons = await scheduleService.getWeekSchedule(formatDate(weekStart))
    console.log('weekLessons======', weekLessons);
    setLessons(weekLessons)
  }

  // 处理周切换
  const handlePrevWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  // 获取指定时间段的课程
  const getLessonByTime = (date: string, timeSlot: typeof TIME_SLOTS[0]) => {
    const timeKey = `${date}-${timeSlot.start}`
    return lessons.find(lesson => lesson.startTime === timeKey)
  }

  // 处理课程点击
  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setIsOpened(true)
  }

  // 处理考勤
  const handleAttendance = async (status: LessonStatus) => {
    if (!selectedLesson) return
    
    const success = await scheduleService.updateLessonStatus(selectedLesson.id, status)
    if (success) {
      await loadWeekSchedule() // 重新加载数据
      setIsOpened(false)
      Taro.showToast({
        title: '考勤成功',
        icon: 'success'
      })
    }
  }

  // 新增排课
  const handleAddSchedule = () => {
    Taro.navigateTo({
      url: '/pages/schedule/add/index'
    })
  }

  return (
    <PageContainer className='schedule'>
      <WeekSelector
        weekStart={formatDisplayDateRange(weekStart, weekEnd)}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
      />
      
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
                <View key={timeSlot.start} className='schedule-cell'>
                  {lesson && (
                    <LessonCard
                      lesson={lesson}
                      onClick={handleLessonClick}
                    />
                  )}
                </View>
              )
            })}
          </View>
        ))}
      </View>

      <View className='add-button' onClick={handleAddSchedule}>
        新增排课
      </View>

      <AtFloatLayout
        isOpened={isOpened}
        title={`${selectedLesson?.studentName || ''} - ${selectedLesson?.subject || ''}`}
        onClose={() => setIsOpened(false)}
      >
        <View className='attendance-actions'>
          <View 
            className='action-button normal'
            onClick={() => handleAttendance(LessonStatus.COMPLETED)}
          >
            正常出勤
          </View>
          <View 
            className='action-button leave'
            onClick={() => handleAttendance(LessonStatus.LEAVE)}
          >
            请假
          </View>
          <View 
            className='action-button absent'
            onClick={() => handleAttendance(LessonStatus.ABSENT)}
          >
            缺勤
          </View>
        </View>
      </AtFloatLayout>
    </PageContainer>
  )
}

export default Schedule 