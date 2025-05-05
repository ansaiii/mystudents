import { PropsWithChildren } from 'react'
import Taro, { useLaunch, useDidShow } from '@tarojs/taro'

import './app.scss'
import 'taro-ui/dist/style/index.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
    Taro.cloud.init({
      env: 'cloud1-9glrscs50f79c44e',
      traceUser: true,
    })

    // 检查登录状态
    const checkLogin = async () => {
      try {
        const { result } = await Taro.cloud.callFunction({
          name: 'getOpenId'
        })
        
        if (!result || !result.openid) {
          // 未登录，跳转到登录页
          Taro.redirectTo({
            url: '/pages/login/index'
          })
        }
      } catch (error) {
        console.error('检查登录状态失败:', error)
        Taro.redirectTo({
          url: '/pages/login/index'
        })
      }
    }

    checkLogin()
  })

  // 监听页面显示，控制 tabBar 显示状态
  useDidShow(() => {
    const checkTabBar = async () => {
      try {
        const { data: userRole } = await Taro.getStorage({ key: 'userRole' })
        const currentPage = Taro.getCurrentPages()
        const isTabBarPage = currentPage.length > 0 && 
          ['/pages/schedule/index', '/pages/contract/index'].includes(currentPage[currentPage.length - 1].route)
        
        if (isTabBarPage) {
          if (userRole === 'parent') {
            Taro.hideTabBar()
          } else {
            Taro.showTabBar()
          }
        }
      } catch (error) {
        console.error('获取用户角色失败:', error)
      }
    }
    checkTabBar()
  })

  // children 是将要会渲染的页面
  return children
}
  


export default App
