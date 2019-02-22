const config = {
  install(Vue) {
    const vue = Vue;
    vue.prototype.$config = config;
  },
  API_URL: process.env.VUE_APP_API_URL,
  APP_ID: process.env.VUE_APP_ID,
  enablePer: false, // 是否启用权限模式
  OSS_URL: 'http://marryfile.oss-cn-hangzhou.aliyuncs.com'
};

export default config;
