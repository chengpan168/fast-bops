export default {
  operation: {
    value: 'bannerRecommends',
    openName: ['home'],
    child: [
      {
        label: '首页',
        value: 'home',
        child: [
          { label: '轮播图', path: '/home/bannerRecommends', value: 'bannerRecommends' },
          { label: '商家分类', path: '/home/classifys', value: 'classifys' },
          { label: '本周热推', path: '/home/hotRecommends', value: 'hotRecommends' },
          { label: '猜你喜欢', path: '/home/likeRecommends', value: 'likeRecommends' }
        ]
      },
      {
        label: '商家',
        value: 'merchant',
        child: [
          { label: '热搜关键词', path: '/merchant/antistops', value: 'antistops' },
          { label: '商家列表', path: '/merchants', value: 'merchants' },
          { label: '全部套系', path: '/merchant/allCommoditys', value: 'allCommoditys' },
          { label: '优惠套餐', path: '/merchant/discountsCommoditys', value: 'discountsCommoditys' },
          { label: '作品精选', path: '/merchant/bestCommoditys', value: 'bestCommoditys' },
          { label: '宴会厅', path: '/merchant/banquetHallCommoditys', value: 'banquetHallCommoditys' },
          { label: '婚宴菜单', path: '/merchant/weddingMenuCommoditys', value: '/merchant/weddingMenuCommoditys' },
          { label: '婚礼案例', path: '/merchant/weddingCases', value: 'weddingCases' },
          { label: '视频作品', path: '/merchant/videos', value: 'videos' }
        ]
      },
      {
        label: '活动',
        value: 'activity',
        child: [
          { label: '活动列表', path: '/activitys', value: 'activityCommoditys' }
        ]
      },
      {
        label: '用户管理',
        value: 'user',
        child: [
          { label: '预约用户', path: '/users/reserve', value: 'UsersReserve' },
          { label: '用户列表', path: '/users', value: 'users' }
        ]
      },
      {
        label: '系统管理',
        value: 'sys',
        child: [
          { label: '消息推送', path: '/sys/pushMsgs', value: 'pushMsgs' },
          { label: '管理员设置', path: '/sys/admins', value: 'admins' },
          { label: '黄道吉日', path: '/sys/faustus', value: 'faustus' }
        ]
      }
    ]
  }
};
