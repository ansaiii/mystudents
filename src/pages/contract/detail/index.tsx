import { useEffect, useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { Contract } from '../../../types/contract'
import { useContract } from '../../../hooks/useContract'
import PageContainer from '../../../components/PageContainer'
import './index.less'

const ContractDetail = () => {
  const router = useRouter()
  const { getContractById } = useContract()
  const [contract, setContract] = useState<Contract | null>(null)

  useEffect(() => {
    const { id } = router.params
    if (id) {
      loadContract(id)
    }
  }, [])

  const loadContract = async (id: string) => {
    const data = await getContractById(id)
    setContract(data)
  }

  if (!contract) {
    return <View>加载中...</View>
  }

  return (
    <PageContainer className='contract-detail'>
      <View className='detail-card'>
        <View className='card-header'>
          <Text className='student-name'>{contract.studentName}</Text>
          <Text className='contract-id'>合同编号：{contract.id}</Text>
        </View>

        <View className='info-section'>
          <View className='info-item'>
            <Text className='label'>开始日期</Text>
            <Text className='value'>{contract.startDate}</Text>
          </View>
          <View className='info-item'>
            <Text className='label'>总课时</Text>
            <Text className='value'>{contract.totalHours}课时</Text>
          </View>
          <View className='info-item'>
            <Text className='label'>剩余课时</Text>
            <Text className='value highlight'>{contract.remainingHours}课时</Text>
          </View>
          <View className='info-item'>
            <Text className='label'>课时单价</Text>
            <Text className='value'>¥{contract.pricePerHour}</Text>
          </View>
          <View className='info-item'>
            <Text className='label'>合同总额</Text>
            <Text className='value'>¥{contract.totalAmount}</Text>
          </View>
        </View>

        <View className='action-section'>
          <Button className='action-button warning'>请假</Button>
          <Button className='action-button primary'>签到</Button>
        </View>
      </View>
    </PageContainer>
  )
}

export default ContractDetail 