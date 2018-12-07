import './polyfill';
import dva from 'dva';
import { message } from 'antd';
// import createLogger from 'redux-logger';

import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';

import './index.less';
// 1. Initialize
const app = dva({
  history: createHistory(),

  // 全局错误处理钩子函数 add by syi
  onError(e) {
    message.warning(e.message);
  },

  // 用于注册redux中间件
  // onAction: createLogger,
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
