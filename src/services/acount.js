import request from 'utils/request';
// import { getParamsString } from 'utils/utils';
// import { config } from './index';
//
// const env = process.env.ENV;
// const prefix = env === 'prod' ? config.prod.account : config.dev.account;

// login 登录
export async function fakeAccountLogin(params) {
  return request({
    url: `/api/v1/login`,
    method: 'POST',
    data: params,
  });
}
