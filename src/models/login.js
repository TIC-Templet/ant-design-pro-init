import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin } from '../services/acount';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery, compile } from '../utils/utils';
import message from '../components/Message';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    roles: '',
    adminData: null,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
      });
      if (response) {
        if (response.success) {
          const { data } = response;
          try {
            if (!data.roles.includes('root') && !data.roles.includes('admin')) {
              message.warning('账号不是管理员');
              return;
            }
          } catch (e) {
            message.warning('账号不是管理员');
            return;
          }
          // 登录之后把管理员信息存在localstorage
          // 并且存在redux，取值的时候都从redux取
          // 刷新页面的时候，再把localstorage的值取出设置到redux内——common/router line210
          window.localStorage.setItem('user', compile(JSON.stringify(data)));
          yield put({
            type: 'setAdminData',
            payload: data,
          });
          reloadAuthorized();
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.startsWith('/#')) {
                redirect = redirect.substr(2);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
          yield put(routerRedux.replace('/'));
        }
      }
    },
    *logout(_, { put }) {
      window.localStorage.clear();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
      yield put({ type: 'clearLogout' });
    },
    *clearLogout(_, { put }) {
      window.localStorage.clear();
      yield put({
        type: 'clearAdminData',
        payload: false,
      });
    },
  },

  reducers: {
    changeLoginStatus(state) {
      setAuthority('admin');
      return {
        ...state,
        status: 'OK',
        type: 'login',
      };
    },
    setAdminData(state, { payload }) {
      return {
        ...state,
        adminData: { ...state.adminData, ...payload },
      };
    },
    clearAdminData(state) {
      return {
        ...state,
        adminData: null,
      };
    },
  },
};
