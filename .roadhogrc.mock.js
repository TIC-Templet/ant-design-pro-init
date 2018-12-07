import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';
import { config } from './src/services';
// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';
// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
};

// 代理
const configData = config.dev;
const host = configData.url || '';
export default (noProxy
    ? {
          [`GET /api/(.*)`]: `${host}/api/`,
          [`POST /api/(.*)`]: `${host}/api/`,
          [`PUT /api/(.*)`]: `${host}/api/`,
          [`DELETE /api/(.*)`]: `${host}/api/`,
      }
    : delay(proxy, 1000));
