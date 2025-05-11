import { useState, useEffect } from 'react'
import { View, Text, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtFloatLayout } from 'taro-ui'
import PageContainer from '../../components/PageContainer'
import WeekSelector from '../../components/WeekSelector'
import { Lesson, LessonStatus as LessonStatusType } from '../../types/schedule'
import { LessonStatus } from '../../../../types/schedule'
import LessonCard from '../../components/LessonCard'
import { scheduleService } from '../../services/schedule'
import { getWeekStart, getWeekEnd, formatDisplayDate, formatDate, getDatesBetween, formatDisplayDateRange, formatDisplayDateWithoutYear } from '../../utils/date'
import StudentSelector from '../../components/StudentSelector'
import FormItem from '../../components/FormItem'
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

interface FormData {
  studentName: string
  contractId: string
  subject: string
  date: string
  timeSlot: string
}

const Schedule = () => {
  const [loading, setLoading] = useState(false)
  const [isOpened, setIsOpened] = useState(false)
  const [isAddMode, setIsAddMode] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<Lesson>({} as Lesson)
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    contractId: '',
    subject: '软笔书法',
    date: '',
    timeSlot: ''
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [lessons, setLessons] = useState<Lesson[]>([])

  // 获取当前周的日期范围
  const weekStart = getWeekStart(currentDate)
  const weekEnd = getWeekEnd(currentDate)
  const weekDates = getDatesBetween(weekStart, weekEnd)

  // 加载周课表数据
  useEffect(() => {
    loadWeekSchedule()
  }, [currentDate])

  const loadWeekSchedule = async () => {
    const weekLessons = await scheduleService.getWeekSchedule(formatDate(weekStart), formatDate(weekEnd))
    // console.log('weekLessons=======', weekLessons);
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

  // 处理课程点击
  const handleLessonClick = (lesson: Lesson) => {
    console.log('lesson=======', lesson);
    setSelectedLesson(lesson)
    setIsAddMode(false)
    setIsOpened(true)
  }

  // 处理单元格点击
  const handleCellClick = (date: Date, timeSlot: typeof TIME_SLOTS[0]) => {
    setFormData(prev => ({
      ...prev,
      date: formatDate(date),
      timeSlot: `${timeSlot.start}-${timeSlot.end}`
    }))
    setSelectedLesson({} as Lesson)
    setIsAddMode(true)
    setIsOpened(true)
  }

  // 处理考勤
  const handleAttendance = async (status: LessonStatusType) => {
    if (!selectedLesson) return
    console.log('selectedLesson=======', selectedLesson);

    // 检查是否重复签到
    if (status === LessonStatus.COMPLETED && selectedLesson.status === LessonStatus.COMPLETED) {
      const { confirm } = await Taro.showModal({
        title: '重复签到提醒',
        content: '该课程已经有过出勤记录，是否确认再次签到？',
        confirmText: '确认',
        cancelText: '取消'
      })
      
      if (!confirm) return
    }

    const success = await scheduleService.updateLessonStatus(selectedLesson._id, status)
    if (success) {
      await loadWeekSchedule()
      setIsOpened(false)
      Taro.showToast({
        title: '考勤成功',
        icon: 'success'
      });
    }
  }

  // 处理新增课程提交
  const handleSubmit = async () => {
    if (!formData.studentName || !formData.contractId || !formData.subject) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    setLoading(true)
    try {
      // await checkTimeConflict()

      const [startTime, endTime] = formData.timeSlot.split('-')

      await scheduleService.addLesson({
        studentId: formData.contractId,
        studentName: formData.studentName,
        subject: formData.subject,
        startTime: `${formData.date}-${startTime}`,
        endTime: `${formData.date}-${endTime}`,
        status: LessonStatus.PENDING as LessonStatusType,
        contractId: formData.contractId
      })

      Taro.showToast({
        title: '创建成功',
        icon: 'success'
      })

      await loadWeekSchedule()
      setIsOpened(false)
    } catch (error) {
      Taro.showToast({
        title: error.message || '创建失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

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
                const lessonArr = lessons.filter(l =>
                  l.startTime === `${formatDate(date)}-${timeSlot.start}`
                )
                return (
                  <View
                    key={timeSlot.start}
                    className={`schedule-cell ${lessonArr.length > 0 ? 'has-lesson' : ''}`}
                    onClick={() => lessonArr.length > 0 ? () => { } : handleCellClick(date, timeSlot)}
                  >
                    {lessonArr.length > 0 ? (
                      <View>
                        {
                          lessonArr.map(lesson => (
                            <LessonCard
                              key={lesson.id}
                              lesson={lesson}
                              onClick={() => handleLessonClick(lesson)}
                            />
                          ))
                        }
                        <View onClick={() => handleCellClick(date, timeSlot)}>+</View>
                      </View>
                    ) : (
                      <Text>排课</Text>
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
        title={isAddMode ? '新增课程' : `${selectedLesson?.studentName || ''} - ${selectedLesson?.subject || ''}`}
        onClose={() => setIsOpened(false)}
      >
        {isAddMode ? (
          <View className='form-container'>
            <FormItem label='选择学员' required>
              <StudentSelector
                value={formData.studentName ? {
                  studentName: formData.studentName,
                  contractId: formData.contractId
                } : undefined}
                onChange={({ studentName, contractId }) => {
                  setFormData(prev => ({ ...prev, studentName, contractId }))
                }}
              />
            </FormItem>

            <FormItem label='课程科目' required>
              <Input
                className='input'
                placeholder='请输入课程科目'
                value={formData.subject}
                onInput={e => setFormData(prev => ({ ...prev, subject: e.detail.value }))}
              />
            </FormItem>

            <FormItem label='上课日期' required>
              <Picker
                mode='date'
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.detail.value }))}
              >
                <View className='picker'>
                  {formData.date || '请选择上课日期'}
                </View>
              </Picker>
            </FormItem>

            <FormItem label='时间段' required>
              <Picker
                mode='selector'
                range={Object.keys(TIME_SLOT_LABELS)}
                value={Object.keys(TIME_SLOT_LABELS).indexOf(formData.timeSlot)}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  timeSlot: Object.keys(TIME_SLOT_LABELS)[Number(e.detail.value)]
                }))}
              >
                <View className='picker'>
                  {formData.timeSlot ? `${formData.timeSlot} (${TIME_SLOT_LABELS[formData.timeSlot]})` : '请选择时间段'}
                </View>
              </Picker>
            </FormItem>

            <View className='form-footer'>
              <Button
                className='submit-button'
                onClick={handleSubmit}
                loading={loading}
              >
                提交
              </Button>
            </View>
          </View>
        ) : (
          <View className='attendance-actions'>
            <View
              className='action-button normal'
              onClick={() => handleAttendance(LessonStatus.COMPLETED as LessonStatusType)}
            >
              正常出勤
            </View>
            <View
              className='action-button leave'
              onClick={() => handleAttendance(LessonStatus.LEAVE as LessonStatusType)}
            >
              请假
            </View>
            <View
              className='action-button absent'
              onClick={() => handleAttendance(LessonStatus.ABSENT as LessonStatusType)}
            >
              缺勤
            </View>
          </View>
        )}
      </AtFloatLayout>
    </PageContainer>
  )
}

export default Schedule 