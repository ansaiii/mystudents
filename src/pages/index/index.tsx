import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import { useLoad } from '@tarojs/taro';

import WorkingDay from './components/WorkingDay';

import './index.scss'

const WORKING_TIME = [{
  start: '8',
  end: '10'
}, {
  start: '10',
  end: '12'
}, {
  start: '12',
  end: '14'
}, {
  start: '14',
  end: '16'
}, {
  start: '16',
  end: '18'
}, {
  start: '18',
  end: '20'
}, {
  start: '20',
  end: '22'
}, {
  start: '22',
  end: '24'
}];

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <WorkingDay
        workingTime={WORKING_TIME}
        students={['张三', '李四', '王五']}
      />
    </View>
  )
}
