export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/account/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#000000',
    selectedColor: '#07c160',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '课表',
        iconPath: 'assets/tab-bar/home.jpg',
        selectedIconPath: 'assets/tab-bar/home-focused.jpg'
      },
      {
        pagePath: 'pages/account/index',
        text: '合同',
        iconPath: 'assets/tab-bar/acc.jpg',
        selectedIconPath: 'assets/tab-bar/acc-focused.jpg'
      }
    ]
  },
})
