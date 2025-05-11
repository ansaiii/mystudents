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

    // 检查登录状态和角色
    const checkLoginAndRole = async () => {
      try {
        console.log('检查登录状态和角色')
        let openId = null
        let userRole = null

        try {
          const { data } = await Taro.getStorage({ key: 'openId' })
          openId = data
          console.log('openId', openId)
        } catch (e) {
          console.log('未找到 openId')
        }

        try {
          const { data } = await Taro.getStorage({ key: 'userRole' })
          userRole = data
          console.log('userRole', userRole)
        } catch (e) {
          console.log('未找到 userRole')
        }

        // 等待应用初始化完成
        await new Promise(resolve => setTimeout(resolve, 500))

        if (openId && userRole && (userRole === 'parent' || userRole === 'teacher')) {
          // 有 openId 和角色信息，直接跳转到对应页面
          if (userRole === 'parent') {
            try {
              await Taro.redirectTo({
                url: '/pages/parent/index'
              })
            } catch (e) {
              console.error('跳转家长页面失败:', e)
            }
          } else {
            try {
              await Taro.switchTab({
                url: '/pages/schedule/index'
              })
            } catch (e) {
              console.error('跳转课表页面失败:', e)
            }
          }
        } else {
          // 没有 openId 或角色信息，跳转到登录页
          try {
            await Taro.redirectTo({
              url: '/pages/login/index'
            })
          } catch (e) {
            console.error('跳转登录页面失败:', e)
          }
        }
      } catch (error) {
        console.error('检查登录状态失败:', error)
        Taro.redirectTo({
          url: '/pages/login/index'
        })
      }
    }

    checkLoginAndRole()
  })

  // 监听页面显示，控制 tabBar 显示状态
  useDidShow(() => {
    const checkTabBar = async () => {
      try {
        const { data: userRole } = await Taro.getStorage({ key: 'userRole' })
        const currentPage = Taro.getCurrentPages()
        const currentRoute = currentPage.length > 0 ? currentPage[currentPage.length - 1].route : ''
        const isTabBarPage = currentRoute && 
          ['/pages/schedule/index', '/pages/contract/index'].includes(currentRoute)
        
        if (isTabBarPage && userRole === 'parent') {
          Taro.hideTabBar()
        } else if (isTabBarPage) {
          Taro.showTabBar()
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
