// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { lesson } = event
  
  try {
    // 生成课程ID
    const lessonId = `lesson_${Date.now()}`
    const newLesson = {
      _id: lessonId,
      ...lesson,
      _openid: wxContext.OPENID,
      createTime: db.serverDate()
    }

    // 将课程添加到数据库
    await db.collection('schedules').add({
      data: newLesson
    })

    return {
      code: 200,
      data: newLesson,
      message: '添加课程成功'
    }
  } catch (error) {
    console.error('添加课程失败:', error)
    return {
      code: 500,
      message: '添加课程失败'
    }
  }
} 