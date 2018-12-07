import axios from 'axios';
import { routerRedux } from 'dva/router';
import store from '../index';
import message from '../components/Message';
import { config as configSet } from '../services';
/**
 * ajax的接口请求统一配置文件(使用axios)
 */
const env = process.env.ENV;
const url = env === 'prod' ? configSet.prod.url : configSet.dev.url;
// 创建axios实例
const service = axios.create({
  baseURL: url, // api的base_url
  timeout: 15000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    const loginState = store.getState().login;
    const { token } = loginState.adminData || { token: null };
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    if (token) {
      config.headers.Authorization = token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (!res.success) {
      console.log('FAILED:', res);
      message.warn(res.message || '请重新尝试');
    }
    return res;
  },
  error => {
    const res = error.response;
    console.log('error:', res);
    try {
      if (res.status === 401) {
        const { dispatch } = store;
        dispatch(routerRedux.replace('/user/login'));
        dispatch({ type: 'login/clearLogout' });
        res.data.message = '登入已过期';
      } else {
        message.warning(error.response.data.message || error.message || '服务器错误，请稍后再试');
      }
      return error.response.data || error;
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: '访问失败',
      };
    }
  }
);

export default service;
