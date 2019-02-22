const Home = () => import(/* webpackChunkName: "home" */ '../pages/Home.vue');
const Login = () => import(/* webpackChunkName: "other" */ '../pages/Login.vue');

// home
const Classifys = () => import(/* webpackChunkName: "home" */ '../pages/homePage/classifys');
const EditorClassifys = () => import(/* webpackChunkName: "home" */ '../pages/homePage/editorClassify');

const Recommends = () => import(/* webpackChunkName: "home" */ '../pages/homePage/recommends');
const EditorRecommends = () => import(/* webpackChunkName: "home" */ '../pages/homePage/editorRecommend');

// merchant

const Antistops = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/antistops');
const EditorAntistops = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/editorAntistops');

const Merchants = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant');
const MerchantEditors = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/editor');

const Commoditys = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/commoditys');
const EditorCommoditys = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/editorCommoditys');

const Banquets = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/banquets');
const EditorBanquets = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/editorBanquets');

const WeddingMenus = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/weddingMenus');
const EditorWeddingMenus = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/editorWeddingMenus');

const WeddingCases = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/weddingCases');
const EditorWeddingCases = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/editorWeddingCases');

const Videos = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/videos');
const EditorVideos = () => import(/* webpackChunkName: "merchant" */ '../pages/merchant/editorVideos');

// activity

const Activitys = () => import(/* webpackChunkName: "activity" */ '../pages/activity');
const EditorActivitys = () => import(/* webpackChunkName: "activity" */ '../pages/activity/editor');

// user

const Users = () => import(/* webpackChunkName: "user" */ '../pages/userManager');
const UsersReserve = () => import(/* webpackChunkName: "user" */ '../pages/userManager/reserve');

// sys

const PushMsgs = () => import(/* webpackChunkName: "sys" */ '../pages/sysManager/pushMsgs');
const Faustus = () => import(/* webpackChunkName: "sys" */ '../pages/sysManager/faustus');
const Admins = () => import(/* webpackChunkName: "sys" */ '../pages/sysManager/admins');

// const Activitys = ()

// let arr = [{
//   path: '/',
//   component: List
// }];
// arr = arr.concat([]);

const routerConfig = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        redirect: { name: 'users' }
      },
      {
        path: '/home/classifys',
        name: 'classifys',
        component: Classifys
      },
      {
        path: '/home/classifys/editor',
        name: 'editorClassifys',
        component: EditorClassifys
      },
      {
        path: '/home/bannerRecommends',
        name: 'bannerRecommends',
        component: Recommends
      },
      {
        path: '/home/bannerRecommends/editor',
        name: 'editorBannerRec',
        component: EditorRecommends
      },
      {
        path: '/home/hotRecommends',
        name: 'hotRecommends',
        component: Recommends
      },
      {
        path: '/home/hotRecommends/editor',
        name: 'editorHotRec',
        component: EditorRecommends
      },
      {
        path: '/home/likeRecommends',
        name: 'likeRecommends',
        component: Recommends
      },
      {
        path: '/home/likeRecommends/editor',
        name: 'editorLikeRec',
        component: EditorRecommends
      },
      {
        path: '/merchant/antistops',
        name: 'antistops',
        component: Antistops
      },
      {
        path: '/merchant/antistop/editor',
        name: 'editorAntistops',
        component: EditorAntistops
      },
      {
        path: '/merchants',
        name: 'merchants',
        component: Merchants
      },
      {
        path: '/merchants/editor',
        name: 'merchantsEditor',
        component: MerchantEditors
      },
      {
        path: '/merchant/allCommoditys',
        name: 'allCommoditys',
        component: Commoditys
      },
      {
        path: '/merchant/discountsCommoditys',
        name: 'discountsCommoditys',
        component: Commoditys
      },
      {
        path: '/merchant/bestCommoditys',
        name: 'bestCommoditys',
        component: Commoditys
      },
      {
        path: '/merchant/commoditys/editor',
        name: 'commoditysEditor',
        component: EditorCommoditys
      },
      {
        path: '/merchant/banquetHallCommoditys',
        name: 'banquetHallCommoditys',
        component: Banquets
      },
      {
        path: '/merchant/banquetHallCommoditys/editor',
        name: 'banquetEditor',
        component: EditorBanquets
      },
      {
        path: '/merchant/weddingMenuCommoditys',
        name: 'weddingMenuCommoditys',
        component: WeddingMenus
      },
      {
        path: '/merchant/weddingMenuCommoditys/editor',
        name: 'weddingMenuEditor',
        component: EditorWeddingMenus
      },
      {
        path: '/merchant/weddingCases',
        name: 'weddingCases',
        component: WeddingCases
      },
      {
        path: '/merchant/weddingCases/editor',
        name: 'editorWeddingCases',
        component: EditorWeddingCases
      },
      {
        path: '/merchant/videos',
        name: 'videos',
        component: Videos
      },
      {
        path: '/merchant/videos/editor',
        name: 'editorVideos',
        component: EditorVideos
      },
      {
        path: '/activitys',
        name: 'activityCommoditys',
        component: Activitys
      },
      {
        path: '/activity/editor',
        name: 'editorActivitys',
        component: EditorActivitys
      },
      {
        path: '/users',
        name: 'users',
        component: Users
      },
      {
        path: '/users/reserve',
        name: 'UsersReserve',
        component: UsersReserve
      },
      {
        path: '/sys/pushMsgs',
        name: 'pushMsgs',
        component: PushMsgs
      },
      {
        path: '/sys/admins',
        name: 'admins',
        component: Admins
      },
      {
        path: '/sys/faustus',
        name: 'faustus',
        component: Faustus
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
];

export default routerConfig;
