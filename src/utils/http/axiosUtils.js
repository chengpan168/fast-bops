import axios from 'axios';
import qs from 'qs';
import Vue from 'vue';

axios.defaults.transformRequest.push((data = {}, headers) => {
  if (headers['Content-Type'] === 'application/x-www-form-urlencoded' && typeof data === 'string') {
    return qs.stringify(JSON.parse(data), { arrayFormat: 'indices', skipNulls: true, allowDots: true });
  }
  return data;
});

export default function () {
  const instance = axios.create({
    baseURL: Vue.prototype.$config.API_URL,
    timeout: 30000
  });
  return instance;
}
