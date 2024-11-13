export default defineAppConfig({
  pages: [
    'pages/index/index'
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
        text: '首页',
        iconPath: 'assets/tab-bar/home.png',
        selectedIconPath: 'assets/tab-bar/home-active.png'
      },
      {
        pagePath: 'pages/about/index',
        text: '关于',
        iconPath: 'assets/tab-bar/about.png',
        selectedIconPath: 'assets/tab-bar/about-active.png'
      }
    ]
  },
})
