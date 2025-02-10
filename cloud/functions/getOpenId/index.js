exports.main = async (event, context) => {
  return event.userInfo.openId
}
