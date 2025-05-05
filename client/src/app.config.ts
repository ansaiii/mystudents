export default defineAppConfig({
  pages: [
    'pages/login/index',      // 登录页面
    'pages/schedule/index',    // 课表管理页面（包含考勤功能）
    'pages/contract/index',    // 合同管理页面
    'pages/contract/add/index',
    'pages/contract/detail/index',
    'pages/parent/index',      // 家长专属页面
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    // navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#999999',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/schedule/index',
        text: '课表',
        iconPath: './assets/icons/schedule.png',
        selectedIconPath: './assets/icons/schedule-active.png'
      },
      {
        pagePath: 'pages/contract/index',
        text: '合同',
        iconPath: './assets/icons/contract.png',
        selectedIconPath: './assets/icons/contract-active.png'
      }
    ]
  }
})
