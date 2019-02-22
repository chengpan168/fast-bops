export const ERROR_LEVEL = {
  ERROR_LEVEL_01: 1, // 优先级最高 不支持访问 无权限 重定向404
  ERROR_LEVEL_02: 2, // 登出直接回归到登录页面
  ERROR_LEVEL_03: 3, // 一旦出错直接 页面只渲染 header和 footer
  ERROR_LEVEL_04: 4, // 出现错误 但是允许通过 返回 {}
  ERROR_LEVEL_05: 5, // toast
  ERROR_LEVEL_06: 6, // modal
  ERROR_LEVEL_07: 7, // 链接异常 超时 或者 接口访问拒绝
  ERROR_LEVEL_08: 8, // 网络出错
  ERROR_LEVEL_09: 9 // 自定义
};

export const STATUS_CODE = {
  AUTH_LOGIN: '400',
  NETWORK_ERR: 'Error: Network Error'
};

export const STORE_TOKEN = 'token';
export const STORE_USER_INFO = 'userInfo';


export const statusMap = {
  available: '可用',
  disable: '禁用'
};

export const topMap = {
  n: '未置顶',
  y: '已置顶'
};

export const statusReverseMap = {
  available: 'disable',
  disable: 'available'
};

export const topReverseMap = {
  n: 'y',
  y: 'n'
};

export const recConstants = {
  bannerRecommends: {
    title: '轮播图',
    routerKey: 'bannerRecommends',
    editorName: 'editorBannerRec',
    imgDesc: '750*350',
    queryParams: {
      type: 'banner',
      objectType: 'product'
    }
  },
  hotRecommends: {
    title: '本周热推',
    routerKey: 'hotRecommends',
    editorName: 'editorHotRec',
    imgDesc: '220*200',
    queryParams: {
      type: 'weekHot',
      objectType: 'product'
    }
  },
  likeRecommends: {
    title: '猜你喜欢',
    routerKey: 'likeRecommends',
    editorName: 'editorLikeRec',
    imgDesc: '340*300',
    queryParams: {
      type: 'guessLike',
      objectType: 'product'
    }
  }
};


export const commoditysCons = {
  allCommoditys: {
    title: '全部套系',
    objectType: 'product',
    imgDesc: '340*340',
    type: 'allSet'
  },
  discountsCommoditys: {
    title: '优惠套餐',
    objectType: 'product',
    imgDesc: '340*340',
    type: 'discountSetMeal'
  },
  bestCommoditys: {
    title: '精选作品',
    imgDesc: '340*340',
    objectType: 'product',
    type: 'selectedWorks'
  },
  banquetHallCommoditys: {
    title: '宴会厅',
    imgDesc: '',
    objectType: 'product',
    type: 'banquetHall'
  },
  weddingMenuCommoditys: {
    title: '婚宴菜单',
    imgDesc: '',
    objectType: 'product',
    type: 'weddingMenu'
  },
  activityCommoditys: {
    title: '活动',
    imgDesc: '702*320',
    objectType: 'product',
    type: 'activity'
  }
};
