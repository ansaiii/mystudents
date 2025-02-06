import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.less'

interface WeekSelectorProps {
  weekStart: string
  onPrevWeek: () => void
  onNextWeek: () => void
}

const WeekSelector = ({ weekStart, onPrevWeek, onNextWeek }: WeekSelectorProps) => {
  return (
    <View className='week-selector'>
      <View className='arrow' onClick={onPrevWeek}>
        <AtIcon value='chevron-left' size='24' color='#333' />
      </View>
      <Text className='date-range'>{weekStart}</Text>
      <View className='arrow' onClick={onNextWeek}>
        <AtIcon value='chevron-right' size='24' color='#333' />
      </View>
    </View>
  )
}

export default WeekSelector 