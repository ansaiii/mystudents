import { View } from '@tarojs/components'
import './index.less'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

const PageContainer = ({ children, className = '' }: PageContainerProps) => {
  return (
    <View className={`page-container ${className}`}>
      {children}
    </View>
  )
}

export default PageContainer 