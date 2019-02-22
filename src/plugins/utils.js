
const plugin = {
  install(Vue) {
    const vue = Vue;
    vue.prototype.$utils = plugin;
  }
};

export default plugin;
