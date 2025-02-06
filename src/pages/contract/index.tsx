import { useState } from 'react'
import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageContainer from '../../components/PageContainer'
import ContractCard from '../../components/ContractCard'
import './index.less'

interface Contract {
  id: string
  studentName: string
  startDate: string
  totalHours: number
  remainingHours: number
  pricePerHour: number
  totalAmount: number
}

const Contract = () => {
  const [contracts] = useState<Contract[]>([
    {
      id: '1',
      studentName: '张三',
      startDate: '2024-03-15',
      totalHours: 40,
      remainingHours: 35,
      pricePerHour: 200,
      totalAmount: 8000
    },
    // 可以添加更多测试数据
  ])

  const handleAddContract = () => {
    Taro.navigateTo({
      url: '/pages/contract/add/index'
    })
  }

  const handleContractClick = (contractId: string) => {
    Taro.navigateTo({
      url: `/pages/contract/detail/index?id=${contractId}`
    })
  }

  return (
    <PageContainer className='contract-page'>
      <View className='contract-list'>
        {contracts.map(contract => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onClick={() => handleContractClick(contract.id)}
          />
        ))}
      </View>
      <Button className='add-button' onClick={handleAddContract}>
        新增合同
      </Button>
    </PageContainer>
  )
}

export default Contract 