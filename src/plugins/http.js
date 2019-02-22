import Http from '@utils/http';

const plugin = {
  install(Vue) {
    const vue = Vue;
    vue.prototype.$http = Http;
    // vue.prototype.$get = httpClient.get;
    // vue.prototype.$post = httpClient.post;
    this.$http = Http;
  }
};

export default plugin;
