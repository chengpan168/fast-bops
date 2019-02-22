import logger from '@utils/logger';


import {
  ERROR_LEVEL, STATUS_CODE, STORE_TOKEN, STORE_USER_INFO
} from '@/constant';
import Vue from 'vue';

function handlerErr(config, errCode, errMsg) {
  const { $Message, $localStore } = Vue.prototype;
  switch (errCode) {
    case STATUS_CODE.AUTH_LOGIN:
      $localStore.set(STORE_TOKEN, '');
      $localStore.set(STORE_USER_INFO, '');
      window.location.replace(`/login?referer=${window.location.pathname}`);
      return Promise.reject({
        level: ERROR_LEVEL.ERROR_LEVEL_01, msg: errMsg, status: errCode, url: config.url
      });
    case STATUS_CODE.NETWORK_ERR:
      $Message.error('网络异常，请稍后再试！');
      return Promise.reject({
        level: ERROR_LEVEL.ERROR_LEVEL_08, msg: '网络异常', status: errCode, url: config.url
      });
    default:
      $Message.error(errMsg || '服务端错误！');
      return Promise.reject({
        level: ERROR_LEVEL.ERROR_LEVEL_05, msg: '网络异常', status: errCode, url: config.url
      });
  }
}
export const reqHeaderInterceptor = customHeaders => (config) => {
  const { method, headers } = config;
  const contentType = (config.isJson || config.dataType === 'json')
    ? 'application/json' : 'application/x-www-form-urlencoded';
  headers[method]['Content-Type'] = contentType;
  return {
    ...config,
    headers: {
      ...config.headers,
      ...customHeaders,
      'Content-Type': contentType
    }
  };
};

export const reqLoggerInterceptor = (config) => {
  const {
    url, data, params, method, headers
  } = config;
  logger.debug(
    `url: ${url} | method: ${method} | contentType: ${headers[method]['Content-Type'] || ''} | param: ${JSON.stringify(data || params)}
    `
  );
  return { ...config, startTime: Date.now() };
};

export const reqErrInterceptor = (error) => {
  logger.error('http request error: ', error);
  return Promise.reject(error);
};

export const resInterceptor = isNoInterceptor => (res) => {
  const { config, data } = res;
  const {
    status, msg = '-', data: retData
  } = data;
 	try {
    // 自定义处理
    if (isNoInterceptor) {
      logger.debug(
        `url: ${config.url} | spend: ${(Date.now() - config.startTime)}ms | status: ${status}, ${msg}
        `
      );
      return data;
    }
    logger.debug(
      `url: ${config.url} | spend: ${(Date.now() - config.startTime)}ms | status: ${status}, ${msg}
      `
    );

    // 自己catch处理
    if (status !== 'ok') {
      return handlerErr(config, status, msg);
    }

    return retData;
  } catch (e) {
	    logger.error(
		    `
          error: ${e}
        `
	    );
    return handlerErr(config, status, msg);
  }
};

export const resErrInterceptor = (error) => {
  console.log('error', error);
  const { response, config } = error;
  const { data } = response;
  const { data: busStatus, msg = '-' } = data;
  logger.error(
    `url: ${config.url} | status: ${busStatus}, ${msg} | error: ${error.message} | stack: ${error.stack}
    `
  );
  return handlerErr(config, response.status, response.errMsg);
};
