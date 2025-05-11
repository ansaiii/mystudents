import React from 'react'
import { View, Button, Text, Checkbox, CheckboxGroup, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { AtFloatLayout } from 'taro-ui'
import './index.scss'

const Login = () => {
  const [role, setRole] = useState<'parent' | 'teacher' | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showPhoneDrawer, setShowPhoneDrawer] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const handleRoleSelect = (selectedRole: 'parent' | 'teacher') => {
    setRole(selectedRole)
  }

  const handleSubscribe = async ({ detail }) => {
    const { value } = detail;
    if (value.includes('subscribe')) {
      try {
        const tmplIds = ['S-HAz85J67UO_4vaABu3KnLyUX_8LEYsxoQfKWYdFKk'] // 替换为实际的模板ID
        await Taro.requestSubscribeMessage({
          tmplIds,
          entityIds: [], // 替换为实际的实体ID
          success: (res) => {
            setIsSubscribed(true)
          }
        })

      } catch (error) {
        console.error('订阅消息失败:', error)
        setIsSubscribed(false)
        Taro.showToast({
          title: '订阅失败，请重试',
          icon: 'none'
        })
      }
    } else {
      setIsSubscribed(false);
    }
  }

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phone) {
      setPhoneError('请输入手机号')
      return false
    }
    if (!phoneRegex.test(phone)) {
      setPhoneError('请输入正确的手机号')
      return false
    }
    setPhoneError('')
    return true
  }

  const handlePhoneInput = (e) => {
    const value = e.detail.value
    setPhoneNumber(value)
    if (value) {
      validatePhoneNumber(value)
    } else {
      setPhoneError('')
    }
  }

  const handleSubmitPhone = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      return
    }
    await handleLoginSuccess()
  }

  const handleLoginSuccess = async () => {
    try {
      // 获取openId
      const { code } = await Taro.login()
      const { result } = await Taro.cloud.callFunction({
        name: 'getOpenId',
        data: { code }
      })

      // 调用云函数保存用户信息
      await Taro.cloud.callFunction({
        name: 'saveUserInfo',
        data: {
          userInfo,
          openId: result,
          role,
          phoneNumber
        }
      })

      // 保存用户角色到本地存储
      await Taro.setStorage({
        key: 'userRole',
        data: role
      })
      // 保存openId到本地存储
      await Taro.setStorage({
        key: 'openId',
        data: result
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
    } catch (error) {
      console.error('登录失败:', error)
      Taro.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  }

  const handleLogin = async () => {
    if (!role) {
      Taro.showToast({
        title: '请先选择角色',
        icon: 'none'
      })
      return
    }

    if (!isSubscribed) {
      Taro.showToast({
        title: '请先同意订阅消息通知',
        icon: 'none'
      })
      return
    }

    // 获取用户信息
    Taro.getUserProfile({
      desc: '用于完善用户资料',
      success: ({ userInfo }) => {
        setUserInfo(userInfo)
        setShowPhoneDrawer(true)
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err)
        Taro.showToast({
          title: '获取用户信息失败，请重试',
          icon: 'none'
        })
      }
    })
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
      <View className='subscribe-section'>
        <CheckboxGroup onChange={handleSubscribe}>
          <Checkbox
            value='subscribe'
            checked={isSubscribed}
          >
            接收签到消息通知
          </Checkbox>
        </CheckboxGroup>
      </View>
      <Button
        className='login-button'
        onClick={handleLogin}
        disabled={!role || !isSubscribed}
      >
        登录
      </Button>

      <AtFloatLayout
        isOpened={showPhoneDrawer}
        title='请输入手机号'
        onClose={() => setShowPhoneDrawer(false)}
      >
        <View className='phone-drawer-content'>
          <View className='input-wrapper'>
            <Input
              type='number'
              maxlength={11}
              placeholder='请输入手机号'
              value={phoneNumber}
              onInput={handlePhoneInput}
            />
            {phoneError && <Text className='error-text'>{phoneError}</Text>}
          </View>
          <Button
            className='phone-button'
            onClick={handleSubmitPhone}
          >
            确认
          </Button>
        </View>
      </AtFloatLayout>
    </View>
  )
}

export default Login 