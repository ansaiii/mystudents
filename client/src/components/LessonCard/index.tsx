import { View, Text } from '@tarojs/components'
import { Lesson, LessonStatus } from '../../types/schedule'
import './index.less'

interface LessonCardProps {
  lesson: Lesson
  onClick: (lesson: Lesson) => void
}

const LessonCard = ({ lesson, onClick }: LessonCardProps) => {
  const getStatusClass = (status: LessonStatus) => {
    switch (status) {
      case LessonStatus.COMPLETED:
        return 'completed'
      case LessonStatus.ABSENT:
        return 'absent'
      case LessonStatus.LEAVE:
        return 'leave'
      default:
        return 'pending'
    }
  }

  return (
    <View 
      className={`lesson-card ${getStatusClass(lesson.status)}`}
      onClick={() => onClick(lesson)}
    >
      <Text className='student-name'>{lesson.studentName}</Text>
      <Text className='subject'>{lesson.subject}</Text>
    </View>
  )
}

export default LessonCard 