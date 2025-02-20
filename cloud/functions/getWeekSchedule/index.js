const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { weekStart } = event
  const db = cloud.database()
  
  try {
    const { data } = await db.collection('schedules')
      .where({
        _openid: context.OPENID,
        weekStart: weekStart
      })
      .get()
      
    return {
      code: 200,
      data: data[0] || null,
      message: 'success'
    }
  } catch (err) {
    console.error('云函数调用失败:', err)
    return {
      code: 500,
      message: '服务器错误'
    }
  }
}
