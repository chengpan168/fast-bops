import Vue from 'vue';
import {
  reqErrInterceptor,
  reqHeaderInterceptor,
  reqLoggerInterceptor,
  resErrInterceptor,
  resInterceptor
} from './axiosInterceptors';
import axiosUtils from './axiosUtils';

export default function (isNoResInterceptor) {
  const { $localStore } = Vue.prototype;
  const token = $localStore.get('token') || '';
  const instance = axiosUtils();
  // add logger interceptor
  instance.interceptors.request.use(reqLoggerInterceptor, reqErrInterceptor);
  // add Header interceptor
  instance.interceptors.request.use(reqHeaderInterceptor({
    token
  }), reqErrInterceptor);
  // add res interceptor
  instance.interceptors.response.use(resInterceptor(isNoResInterceptor),
    resErrInterceptor);
  return instance;
}
