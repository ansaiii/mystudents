// 课程状态
const LessonStatus = {
  PENDING: 'pending',    // 未开始
  COMPLETED: 'completed', // 已完成
  ABSENT: 'absent',      // 缺勤
  LEAVE: 'leave'         // 请假
}

// 状态映射表
const StatusMap = {
  [LessonStatus.PENDING]: '未开始',
  [LessonStatus.COMPLETED]: '已完成',
  [LessonStatus.ABSENT]: '缺勤',
  [LessonStatus.LEAVE]: '请假'
}

module.exports = {
  LessonStatus,
  StatusMap
} 