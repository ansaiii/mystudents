// 云函数入口文件
const cloud = require('wx-server-sdk')
const { LessonStatus, StatusMap } = require('../../../types/schedule')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 发送订阅消息
async function sendSubscribeMessage(openid, lesson, status) {
  try {
    await cloud.openapi.subscribeMessage.send({
      touser: openid,
      templateId: 'S-HAz85J67UO_4vaABu3KnLyUX_8LEYsxoQfKWYdFKk',
      data: {
        name3: { value: lesson.studentName }, // 学生姓名
        date4: { value: lesson.date }, // 上课日期
        time5: { value: lesson.startTime }, // 上课时间
        phrase6: { value: StatusMap[status] || status }, // 出勤状态
        thing16: { value: "剩余课时" + lesson.data.remainingHours } // 剩余课时
      }
    })
  } catch (error) {
    console.error('发送订阅消息失败:', error)
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { lessonId, status } = event
  
  try {
    // 获取课程信息
    const lesson = await db.collection('schedules').doc(lessonId).get()
    const { contractId } = lesson.data

    // 如果是正常出勤，需要扣减课时
    if (status === LessonStatus.COMPLETED) {
      // 获取合同信息
      const contract = await db.collection('contracts').doc(contractId).get()
      const { remainingHours, phoneNumber } = contract.data

      // 扣减课时
      await db.collection('contracts').doc(contractId).update({
        data: {
          remainingHours: remainingHours - 1,
          updateTime: db.serverDate()
        }
      })

      // 获取家长openid
      const parentUser = await db.collection('users').where({
        phoneNumber
      }).get()

      if (parentUser.data.length > 0) {
        // 发送订阅消息
        await sendSubscribeMessage(parentUser.data[0]._openid, lesson.data, status)
      }
    }

    // 更新课程状态
    await db.collection('schedules').doc(lessonId).update({
      data: {
        status,
        updateTime: db.serverDate()
      }
    })

    return {
      code: 200,
      message: '更新课程状态成功'
    }
  } catch (error) {
    console.error('更新课程状态失败:', error)
    return {
      code: 500,
      message: '更新课程状态失败'
    }
  }
} 