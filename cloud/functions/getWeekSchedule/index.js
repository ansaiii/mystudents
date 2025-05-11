const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { weekStart, weekEnd } = event
  const db = cloud.database()

  try {
    const { data } = await db.collection('schedules')
      .where({
        // _openid: wxContext.OPENID,
        startTime: db.command.and([
          db.command.gte(weekStart + '-00:00'),
          db.command.lte(weekEnd + '-24:00')
        ])
      })
      .get()

    return {
      code: 200,
      data: data,
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
