import Vue from 'vue';
import defSideNav from '@/layouts/HeaderAsideLayout/sideNav';

const whiteLists = ['/403', '/404'];

function hasPermisssions(perRouter = [], path) {
  if (!path) return false;
  return perRouter.some((item) => {
    const { permissionName } = item;
    const v = permissionName.split(':')[1];
    return v === path;
  });
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param perRouter
 */

function filterRouter(perRouter, curPath) {
  let navKey = '';
  const routers = Object.keys(defSideNav).reduce((pre, cur) => {
    const ret = pre;
    if (!cur) return pre;
    let curValue = '';
    let openIndex = 0;
    let navItem = defSideNav[cur];
    if (navItem.child && navItem.child.length) {
      const navItemChild = navItem.child.map((item, index) => {
        let navItemChildChild = item.child;
        if (navItemChildChild && navItemChildChild.length) {
          navItemChildChild = item.child.filter((v) => {
            const pass = hasPermisssions(perRouter, v.path);
            const isCurPath = curPath === v.path;
            if (isCurPath) {
              curValue = v.value;
              navKey = cur;
              openIndex = index;
            }
            return pass;
          });
        }
        return {
          ...item,
          child: navItemChildChild
        };
      });
      navItem = {
        ...navItem, child: navItemChild, value: curValue || navItem.value, openIndex
      };
    }
    ret[cur] = navItem;
    return pre;
  }, {});
  return {
    routers,
    navKey
  };
}

const permission = {
  state: {
    navKey: 'operation',
    routers: defSideNav
  },
  mutations: {
    INIT_ROUTERS: (state, payload) => {
      const { routers, navKey, curPath } = payload;
      const { $locaStore } = Vue.prototype;
      const v = state;
      const tempRouters = routers;
      const tempNavKey = navKey || $locaStore.get('navKey') || 'operation';
      let defaultItem = '';
      let openIndex = 0;
      if (curPath) {
        tempRouters[tempNavKey].child.forEach((item, index) => {
          item.child.forEach((child) => {
            if (child.path === curPath) {
              defaultItem = child;
              openIndex = index;
            }
          });
        });
        if (defaultItem && defaultItem.value) {
          tempRouters[tempNavKey].value = defaultItem.value;
          tempRouters[tempNavKey].openIndex = openIndex;
        }
      }
      v.routers = tempRouters;
      v.navKey = tempNavKey;
    },
    UPDATE_NAVKEY: (state, payload) => {
      const { navKey } = payload;
      const v = state;
      v.navKey = navKey;
      const { $locaStore } = Vue.prototype;
      $locaStore.set('navKey', navKey);
    }
  },
  actions: {
    GenerateRoutes({ commit }, { toPath }) {
      return new Promise((resolve, reject) => {
        const { $http, $locaStore, $globalConfig } = Vue.prototype;
        const roleId = $locaStore.get('role_id');
        const userId = $locaStore.get('user_id');
        const curPath = toPath === '/' ? '/' : toPath;
        if ($globalConfig.enablePer) { // 启用权限
          $http.post('/permission/getMenuPermissionsByUserId', {
            userId, roleId, isBacked: 'y', siteCode: 'cn', type: 'admin'
          }).then((data) => {
            const cusPathHasPer = hasPermisssions(data, curPath); // 有权限
            const isWhiteList = curPath !== '/' && whiteLists.indexOf(curPath) !== -1; // 白名单
            const obj = filterRouter(data, curPath);
            commit('INIT_ROUTERS', { ...obj });
            if (cusPathHasPer || isWhiteList) {
              resolve();
            } else {
              console.log('err', 403);
              reject(new Error('403'));
            }
          }).catch(() => {
            reject(new Error('600'));
          });
        } else {
          commit('INIT_ROUTERS', { routers: defSideNav, curPath });
          resolve();
        }
      });
    },
    UpdateNav({ commit, state }, { navKey }) {
      commit('UPDATE_NAVKEY', { navKey });
      const routers = state.routers[state.navKey];
      const defaultItem = routers.child.find(item => item.child.find(child => !!child.path));
      let url = '';
      if (defaultItem && defaultItem.child && defaultItem.child.length) {
        url = defaultItem.child[0].path;
      } else {
        url = '/403'; // 无权限页面
      }
      window.location.href = url;
    }
  }
};
export default permission;
