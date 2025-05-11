import { useState, useEffect } from 'react'
import { View, Button } from '@tarojs/components'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
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
    try {
      const allContracts = await getContracts();
      console.log('allContracts=======', allContracts);
      const allContractsWithTotalAmount = allContracts.map(c => {
        return {
          ...c,
          totalAmount: c.pricePerHour * c.totalHours,
        }
      }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setContracts(allContractsWithTotalAmount);
    } catch (error) {
      Taro.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      Taro.stopPullDownRefresh()
    }
  }

  // 页面首次加载时获取数据
  useEffect(() => {
    loadContracts()
  }, [])

  // 下拉刷新
  usePullDownRefresh(() => {
    loadContracts()
  })

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
            key={contract._id}
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