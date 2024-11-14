import { View, Text } from '@tarojs/components';
import dayjs from 'dayjs';

import './index.scss';

export interface WorkingDayProps {
  workingTime: { start: string; end: string; }[];
  students: string[];
}

const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];  

export default function WorkingDay({ workingTime, students }: WorkingDayProps) {
  return (
    <View>
      <View><Text>{dayjs().format('MM-DD')} {WEEK[dayjs().day()]}</Text></View>
      {workingTime.map(({ start, end }, index) => (
        <View key={index} className='time'>
          <Text>{start}~{end}</Text>
          <Text>学生：{students.join('、')}</Text>
        </View>
      ))}
    </View>
  );
}