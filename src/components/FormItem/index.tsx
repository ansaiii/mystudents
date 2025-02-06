import { View, Text } from '@tarojs/components'
import './index.less'

interface FormItemProps {
  label: string
  required?: boolean
  children: React.ReactNode
  error?: string
}

const FormItem = ({ label, required = false, children, error }: FormItemProps) => {
  return (
    <View className='form-item'>
      <View className='form-label'>
        {required && <Text className='required'>*</Text>}
        <Text>{label}</Text>
      </View>
      <View className='form-content'>
        {children}
      </View>
      {error && <Text className='form-error'>{error}</Text>}
    </View>
  )
}

export default FormItem 