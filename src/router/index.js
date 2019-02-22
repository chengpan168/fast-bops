import Vue from 'vue';
import Router from 'vue-router';
import Config from './config';

Vue.use(Router);


const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: Config,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const { $localStore } = Vue.prototype;
  if (to.name === 'login') {
    next();
  } else {
    const token = $localStore.get('token');
    const hasToken = !!token;
    const referer = window.location.pathname;
    if (hasToken) {
      // store.dispatch('GenerateRoutes', { toPath: to.path })
      //   .then(() => {
      //     next();
      //   }).catch((err) => {
      //     const errMsg = err.message;
      //     if (errMsg === '403') { // 没有权限
      //       next({ path: '/403' });
      //     } else if (errMsg === '600') {
      //       $Message.error('权限获取异常，请联系管理员！');
      //       next({ path: `/login?referer=${referer}`, replace: true });
      //     }
      //   });
      next();
    } else {
      next({ path: `/login?referer=${referer}`, replace: true });
    }
  }
});

export default router;
