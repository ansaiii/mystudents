const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  console.log('context=====', context);
  const { contractData } = event
  const db = cloud.database()
  
  try {
    const { _id } = await db.collection('contracts').add({
      data: {
        ...contractData,
        _openid: context.OPENID,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    return {
      code: 200,
      data: { id: _id },
      message: '合同创建成功'
    }
  } catch (err) {
    console.error('云函数调用失败:', err)
    return {
      code: 500,
      message: '服务器错误'
    }
  }
}
