
#### 启动
`npm run start:no-proxy`

#### 路由
* 页面都在'src/routes'文件内
* 路由统一配置在'src/common/router'文件内
* 配置路由的时候动态加载model
```
component: dynamicWrapper(app, ['user', 'login'], () =>
                import('../layouts/BasicLayout')
            ),
```

#### 请求
* dva封装的是'isomorphic-fetch'请求
* 发出请求统一在'src/utils/request'文件处理
* 所有请求都带有Authorization字段
* 所有请求都带有防重放攻击验证
* 接口返回后在request文件内加上了success字段
* api统一写在'src/services/api'文件内

#### 重放攻击验证规则
规则：`timestamp=${timestamp}&nonce=${nonced}&sign=${sign}`<br>
详见'src/utils/utils'的replayAttackVerification方法