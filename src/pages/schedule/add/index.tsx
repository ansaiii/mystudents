import { useState } from 'react'
import { View, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageContainer from '../../../components/PageContainer'
import FormItem from '../../../components/FormItem'
import { scheduleService } from '../../../services/schedule'
import { LessonStatus } from '../../../types/schedule'
import { formatDate, getWeekStart } from '../../../utils/date'
import StudentSelector from '../../../components/StudentSelector'
import './index.less'

interface FormData {
  studentName: string
  contractId: string
  subject: string
  date: string
  timeSlot: string
}

const TIME_SLOTS = [
  '08:00-10:00',  // 第一节课
  '10:20-12:20',  // 第二节课
  '12:40-14:40',  // 第三节课
  '15:00-17:00',  // 第四节课
  '17:20-19:20',  // 第五节课
  '19:40-21:40'   // 第六节课
]

const TIME_SLOT_LABELS = {
  '08:00-10:00': '上午第一节',
  '10:20-12:20': '上午第二节',
  '12:40-14:40': '下午第一节',
  '15:00-17:00': '下午第二节',
  '17:20-19:20': '晚上第一节',
  '19:40-21:40': '晚上第二节'
}

const ScheduleAdd = () => {
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    contractId: '',
    subject: '',
    date: formatDate(new Date()),
    timeSlot: TIME_SLOTS[0]
  })
  const [loading, setLoading] = useState(false)

  // 检查时间冲突
  const checkTimeConflict = async () => {
    const [startTime] = formData.timeSlot.split('-')
    const timeKey = `${formData.date}-${startTime}`
    
    const weekStart = formatDate(getWeekStart(new Date(formData.date)))
    const lessons = await scheduleService.getWeekSchedule(weekStart)
    
    const conflict = lessons.find(lesson => 
      lesson.startTime === timeKey
    )

    if (conflict) {
      throw new Error('该时间段已有课程安排')
    }
  }

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
      await checkTimeConflict()

      const [startTime, endTime] = formData.timeSlot.split('-')
      
      await scheduleService.addLesson({
        studentId: formData.contractId,
        studentName: formData.studentName,
        subject: formData.subject,
        startTime: `${formData.date}-${startTime}`,
        endTime: `${formData.date}-${endTime}`,
        status: LessonStatus.PENDING,
        contractId: formData.contractId
      })

      Taro.showToast({
        title: '创建成功',
        icon: 'success'
      })

      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
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
    <PageContainer className='schedule-add'>
      <View className='form-container'>
        <FormItem label='选择学员' required>
          <StudentSelector
            value={formData.studentName ? {
              studentName: formData.studentName,
              contractId: formData.contractId
            } : undefined}
            onChange={({ studentName, contractId }) => 
              setFormData(prev => ({ ...prev, studentName, contractId }))
            }
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
            range={TIME_SLOTS}
            value={TIME_SLOTS.indexOf(formData.timeSlot)}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              timeSlot: TIME_SLOTS[Number(e.detail.value)]
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
    </PageContainer>
  )
}

export default ScheduleAdd 