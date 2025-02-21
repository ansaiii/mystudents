import { useState } from 'react'
import { View, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useContract } from '../../../hooks/useContract'
import PageContainer from '../../../components/PageContainer'
import FormItem from '../../../components/FormItem'
import './index.less'

interface FormData {
  studentName: string
  totalHours: string
  pricePerHour: string
  startDate: string
}

interface FormErrors {
  studentName?: string
  totalHours?: string
  pricePerHour?: string
  startDate?: string
}

const ContractAdd = () => {
  const { createContract, loading } = useContract()
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    totalHours: '',
    pricePerHour: '',
    startDate: new Date().toISOString().split('T')[0]
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.studentName.trim()) {
      newErrors.studentName = '请输入学员姓名'
    }
    
    if (!formData.totalHours.trim()) {
      newErrors.totalHours = '请输入总课时'
    } else if (isNaN(Number(formData.totalHours)) || Number(formData.totalHours) <= 0) {
      newErrors.totalHours = '请输入有效的课时数'
    }
    
    if (!formData.pricePerHour.trim()) {
      newErrors.pricePerHour = '请输入课时单价'
    } else if (isNaN(Number(formData.pricePerHour)) || Number(formData.pricePerHour) <= 0) {
      newErrors.pricePerHour = '请输入有效的单价'
    }
    
    if (!formData.startDate) {
      newErrors.startDate = '请选择开始日期'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleDateChange = (e: any) => {
    handleInputChange('startDate', e.detail.value)
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      await createContract({
        studentName: formData.studentName,
        totalHours: Number(formData.totalHours),
        pricePerHour: Number(formData.pricePerHour),
        startDate: formData.startDate,
      })
      
      Taro.showToast({
        title: '创建成功',
        icon: 'success'
      })
      
      // 返回上一页并刷新列表
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (error) {
      Taro.showToast({
        title: error.message || '创建失败',
        icon: 'error'
      })
    }
  }

  return (
    <PageContainer className='contract-add'>
      <View className='form-container'>
        <FormItem label='学员姓名' required error={errors.studentName}>
          <Input
            className='input'
            placeholder='请输入学员姓名'
            value={formData.studentName}
            onInput={e => handleInputChange('studentName', e.detail.value)}
          />
        </FormItem>

        <FormItem label='总课时' required error={errors.totalHours}>
          <Input
            className='input'
            type='number'
            placeholder='请输入总课时'
            value={formData.totalHours}
            onInput={e => handleInputChange('totalHours', e.detail.value)}
          />
        </FormItem>

        <FormItem label='课时单价(元)' required error={errors.pricePerHour}>
          <Input
            className='input'
            type='digit'
            placeholder='请输入课时单价'
            value={formData.pricePerHour}
            onInput={e => handleInputChange('pricePerHour', e.detail.value)}
          />
        </FormItem>

        <FormItem label='开始日期' required error={errors.startDate}>
          <Picker
            mode='date'
            value={formData.startDate}
            onChange={handleDateChange}
          >
            <View className='picker'>
              {formData.startDate || '请选择开始日期'}
            </View>
          </Picker>
        </FormItem>

        <View className='form-footer'>
          <Button 
            className='submit-button' 
            onClick={handleSubmit}
            loading={loading}
          >
            提交
          </Button>
        </View>
      </View>
    </PageContainer>
  )
}

export default ContractAdd 