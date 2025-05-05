import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'
import { Contract } from '../../types/contract'
import './index.less'

interface StudentSelectorProps {
  value?: {
    studentName: string
    contractId: string
  }
  onChange: (value: { studentName: string; contractId: string }) => void
}

const StudentSelector = ({ value, onChange }: StudentSelectorProps) => {
  const [isOpened, setIsOpened] = useState(false)
  const [contracts, setContracts] = useState<Contract[]>([])

  // 加载有效合同
  const loadContracts = async () => {
    try {
      const { contractService } = await import('../../services/contract')
      const data = await contractService.getContracts()
      // 只显示还有剩余课时的合同
      setContracts(data.filter(contract => contract.remainingHours > 0))
    } catch (error) {
      console.error('加载合同失败:', error)
    }
  }

  const handleOpen = () => {
    loadContracts()
    setIsOpened(true)
  }

  const handleSelect = (contract: Contract) => {
    console.log('contract=======', contract);
    onChange({
      studentName: contract.studentName,
      contractId: contract._id
    })
    setIsOpened(false)
  }

  return (
    <View className='student-selector'>
      <View className='selector-input' onClick={handleOpen}>
        {value?.studentName || '请选择学员'}
      </View>

      <AtFloatLayout
        isOpened={isOpened}
        title='选择学员'
        onClose={() => setIsOpened(false)}
      >
        <View className='student-list'>
          {contracts.map(contract => (
            <View 
              key={contract.id} 
              className='student-item'
              onClick={() => handleSelect(contract)}
            >
              <Text className='name'>{contract.studentName}</Text>
              <Text className='hours'>剩余{contract.remainingHours}课时</Text>
            </View>
          ))}
          {contracts.length === 0 && (
            <View className='empty-tip'>暂无可用合同</View>
          )}
        </View>
      </AtFloatLayout>
    </View>
  )
}

export default StudentSelector 