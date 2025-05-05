// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { userInfo, openId, role } = event

  try {
    // 检查用户是否已存在
    const user = await db.collection('users').where({
      _openid: openId
    }).get()

    if (user.data.length === 0) {
      // 用户不存在，创建新用户
      await db.collection('users').add({
        data: {
          ...userInfo,
          role,
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })
    } else {
      // 用户已存在，更新用户信息
      await db.collection('users').where({
        _openid: openId
      }).update({
        data: {
          ...userInfo,
          role,
          updateTime: db.serverDate()
        }
      })
    }

    return {
      success: true,
      message: '用户信息保存成功'
    }
  } catch (error) {
    console.error('保存用户信息失败:', error)
    return {
      success: false,
      message: '保存用户信息失败'
    }
  }
} 