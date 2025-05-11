// 云函数入口文件
const cloud = require('wx-server-sdk')
const crypto = require('crypto')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { code, encryptedData, iv } = event
  
  try {
    // 获取 session_key
    const { result } = await cloud.getWXContext()
    const { OPENID, APPID } = result
    
    // 获取 session_key
    const res = await cloud.callFunction({
      name: 'getOpenId',
      data: { code }
    })
    
    const sessionKey = res.result.session_key
    
    // 解密手机号
    const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(sessionKey, 'base64'), Buffer.from(iv, 'base64'))
    decipher.setAutoPadding(true)
    
    let decoded = decipher.update(encryptedData, 'base64', 'utf8')
    decoded += decipher.final('utf8')
    
    const phoneInfo = JSON.parse(decoded)
    
    return {
      phoneNumber: phoneInfo.phoneNumber,
      openid: OPENID,
      appid: APPID
    }
  } catch (err) {
    console.error(err)
    return {
      error: err
    }
  }
} 