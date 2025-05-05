import { View, Button, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

const Login = () => {
  const [role, setRole] = useState<'parent' | 'teacher' | null>(null)

  const handleRoleSelect = (selectedRole: 'parent' | 'teacher') => {
    setRole(selectedRole)
  }

  const handleLogin = async () => {
    if (!role) {
      Taro.showToast({
        title: '请先选择角色',
        icon: 'none'
      })
      return
    }

    try {
      // 获取用户信息
      const { userInfo } = await Taro.getUserProfile({
        desc: '用于完善用户资料'
      })
      console.log('useinfo====', userInfo);
      // 获取手机号
      const { code } = await Taro.login()
      const { result } = await Taro.cloud.callFunction({
        name: 'getOpenId',
        data: { code }
      })
      console.log('openid=====', result);

      // 调用云函数保存用户信息
      await Taro.cloud.callFunction({
        name: 'saveUserInfo',
        data: {
          userInfo,
          openId: result,
          role
        }
      })

      // 保存用户角色到本地存储
      await Taro.setStorage({
        key: 'userRole',
        data: role
      })

      // 根据角色跳转到不同页面
      if (role === 'parent') {
        // 家长角色跳转到家长专属页面
        Taro.navigateTo({
          url: '/pages/parent/index'
        })
      } else {
        // 老师角色跳转到课表页面，显示 tabBar
        Taro.switchTab({
          url: '/pages/schedule/index'
        })
      }

      // 获取订阅消息授权
      // const tmplIds = ['your-template-id'] // 替换为实际的模板ID
      // await Taro.requestSubscribeMessage({
      //   tmplIds
      // })
    } catch (error) {
      console.error('登录失败:', error)
      Taro.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  }

  return (
    <View className='login-container'>
      <View className='title'>请选择您的身份</View>
      <View className='role-buttons'>
        <Button
          className={`role-button ${role === 'parent' ? 'selected' : ''}`}
          onClick={() => handleRoleSelect('parent')}
        >
          我是家长
        </Button>
        <Button
          className={`role-button ${role === 'teacher' ? 'selected' : ''}`}
          onClick={() => handleRoleSelect('teacher')}
        >
          我是老师
        </Button>
      </View>
      <Button
        className='login-button'
        onClick={handleLogin}
        disabled={!role}
      >
        微信登录
      </Button>
    </View>
  )
}

export default Login 