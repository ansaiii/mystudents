// 课程状态
export enum LessonStatus {
  PENDING = 'pending',    // 未开始
  COMPLETED = 'completed', // 已完成
  ABSENT = 'absent',      // 缺勤
  LEAVE = 'leave'         // 请假
}

// 状态映射表
export const StatusMap = {
  [LessonStatus.PENDING]: '未开始',
  [LessonStatus.COMPLETED]: '已完成',
  [LessonStatus.ABSENT]: '缺勤',
  [LessonStatus.LEAVE]: '请假'
}

// 课程信息
export interface Lesson {
  id: string
  studentId: string
  studentName: string
  subject: string
  startTime: string
  endTime: string
  status: LessonStatus
  contractId: string
}

// 周课表数据结构
export interface WeekSchedule {
  weekStart: string
  weekEnd: string
  lessons: {
    [key: string]: Lesson[] // key 格式: "2024-03-18-09:00"
  }
}

// 时间段配置
export interface TimeSlot {
  start: string
  end: string
  label: string
} 