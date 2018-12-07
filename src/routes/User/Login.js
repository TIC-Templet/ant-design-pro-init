import React, { Component } from 'react';
import { Alert } from 'antd';
import { connect } from 'dva';
import Login from 'components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  componentWillMount() {
    this.dispatch = this.props.dispatch;
  }

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          account: values.account,
          password: values.passwords,
        },
      });
    }
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          {login.status === 'error' && !submitting && this.renderMessage('账户或密码错误')}
          <UserName name="account" placeholder="请输入登录账号" />
          <Password name="passwords" placeholder="请输入登录密码" />
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
