import Store from 'store';

const plugin = {
  install(Vue) {
    const v = Vue;
    v.prototype.$localStore = Store;
  }
};

export default plugin;
