import { useState, useEffect } from 'react'
import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageContainer from '../../components/PageContainer'
import ContractCard from '../../components/ContractCard'
import { useContract } from '../../hooks/useContract'

import './index.less'

interface Contract {
  _id: string
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

  const loadContracts = async () => {
    const allContracts = await getContracts();
    const allContractsWithTotalAmount = allContracts.map(c => {
      return {
        ...c,
        totalAmount: c.pricePerHour * c.totalHours,
      }
    });
    setContracts(allContractsWithTotalAmount);
  }

  useEffect(() => {
    loadContracts();
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
      <View className='contract-list'>
        {contracts.map(contract => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onClick={() => handleContractClick(contract._id)}
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