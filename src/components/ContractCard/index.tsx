import { View, Text } from '@tarojs/components'
import './index.less'

interface ContractCardProps {
  contract: {
    studentName: string
    startDate: string
    totalHours: number
    remainingHours: number
    pricePerHour: number
    totalAmount: number
  }
  onClick?: () => void
}

const ContractCard = ({ contract, onClick }: ContractCardProps) => {
  const {
    studentName,
    startDate,
    totalHours,
    remainingHours,
    pricePerHour,
    totalAmount
  } = contract

  return (
    <View className='contract-card' onClick={onClick}>
      <View className='contract-header'>
        <Text className='student-name'>{studentName}</Text>
        <Text className='start-date'>{startDate}</Text>
      </View>
      <View className='contract-body'>
        <View className='info-item'>
          <Text className='label'>总课时：</Text>
          <Text className='value'>{totalHours}课时</Text>
        </View>
        <View className='info-item'>
          <Text className='label'>剩余课时：</Text>
          <Text className='value'>{remainingHours}课时</Text>
        </View>
        <View className='info-item'>
          <Text className='label'>课时单价：</Text>
          <Text className='value'>¥{pricePerHour}</Text>
        </View>
        <View className='info-item'>
          <Text className='label'>合同总额：</Text>
          <Text className='value'>¥{totalAmount}</Text>
        </View>
      </View>
    </View>
  )
}

export default ContractCard 