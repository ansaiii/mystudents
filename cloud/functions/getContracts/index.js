const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database()
  
  try {
    const { data } = await db.collection('contracts')
      .where({
        _openid: wxContext.OPENID
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
