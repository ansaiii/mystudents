import { useState, useEffect } from 'react'
import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageContainer from '../../components/PageContainer'
import ContractCard from '../../components/ContractCard'
import { useContract } from '../../hooks/useContract'

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
  const { getContracts } = useContract()
  const [contracts, setContracts] = useState<Contract[]>([])

  useEffect(() => {
    const allContracts = getContracts();
    setContracts(allContracts);
  }, []);

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
      {/* <View className='contract-list'>
        {contracts.map(contract => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onClick={() => handleContractClick(contract.id)}
          />
        ))}
      </View> */}
      <Button className='add-button' onClick={handleAddContract}>
        新增合同
      </Button>
    </PageContainer>
  )
}

export default Contract 