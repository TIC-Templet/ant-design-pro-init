import React, { Component } from 'react';
import { Modal, Form, Button, Input } from 'antd';
import { routerRedux } from 'dva/router';
import message from 'components/Message';
import { connect } from 'dva';
import {
  password,
  compareToFirstPassword,
  payPassword,
  phone,
  verification,
} from 'utils/validator';
import { msgCountDown } from 'utils/config';
import styles from './index.less';

const FormItem = Form.Item;

@connect(({ users, login, loading }) => ({
  users,
  login,
  loading,
  loadingSendMsg: loading.effects['users/sendMsgEffect'],
  loadingSubmit:
    loading.effects['users/resetLoginPwdEffect'] || loading.effects['users/resetPayPwdEffect'],
}))
class ForgetPwd extends Component {
  state = {
    isAdmin: false,
  };

  componentWillMount() {
    this.dispatch = this.props.dispatch;
  }

  componentDidMount() {
    const { login } = this.props;
    if (login.adminData) {
      this.setState({ isAdmin: true });
    }
  }

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields();
  };

  // 取消
  handleCancel = () => {
    this.dispatch({
      type: 'users/saveForgetPwd',
      payload: { show: false },
    });
    this.handleReset();
  };

  // 重置登录密码
  resetLoginPwdDispatch = (params, callback) => {
    this.dispatch({
      type: 'users/resetLoginPwdEffect',
      payload: { params },
      callback,
    });
  };

  // 重置支付密码
  resetPayPwdEffectDispatch = (params, callback) => {
    this.dispatch({
      type: 'users/resetPayPwdEffect',
      payload: { params },
      callback,
    });
  };

  // 根据用户名手机号查询用户信息
  queryUserBySomethingDispatch = (params, callback) => {
    this.dispatch({
      type: 'users/queryUserBySomethingEffect',
      payload: { params },
      callback: res => callback(res),
    });
  };

  sendMsgDispatch = (params, callback) => {
    this.dispatch({
      type: 'users/sendMsgEffect',
      payload: { params },
      callback,
    });
  };

  phoneOnchange = () => {
    const { form } = this.props;
    const { getFieldError } = form;
    if (getFieldError('phone')) {
      this.setState({ isAdmin: false });
    }
  };

  // 手机号失焦时检测该手机号是否是管理员
  phoneBlur = () => {
    const { form } = this.props;
    const { getFieldError, getFieldValue } = form;
    if (getFieldError('phone') || !getFieldValue('phone')) return false;
    const params = { phone: getFieldValue('phone') };
    this.queryUserBySomethingDispatch(params, res => {
      if (res.success) {
        const role = res.data.roles.toString();
        const isAdmin = role.indexOf('admin') > -1 || role.indexOf('root') > -1;
        if (isAdmin) {
          this.setState({ isAdmin: true });
        } else {
          this.setState({ isAdmin: false });
          message.warning('对不起，您不是管理员！');
        }
      }
    });
  };

  // 发送验证码按钮
  sendMsg = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    const params = { phone: getFieldValue('phone') };
    this.sendMsgDispatch(params, this.sendMsgAction);
  };

  // 发短信接口成功的回调
  sendMsgAction = () => {
    const clickTime = Math.floor(new Date().getTime() / 1000);
    this.dispatch({
      type: 'users/saveForgetPwd',
      payload: { clickTime, hasSendMsg: true },
    });
    this.countDown();
    this.sendMsgTimer = setInterval(this.countDown, 1000);
  };

  // 时间戳倒计时
  countDown = () => {
    const nowTime = Math.floor(new Date().getTime() / 1000);
    const { users } = this.props;
    const { clickTime } = users.forgetPwd;
    if (nowTime - clickTime === msgCountDown) {
      clearInterval(this.sendMsgTimer);
      return this.dispatch({
        type: 'users/saveForgetPwd',
        payload: { hasSendMsg: false },
      });
    }
    this.dispatch({
      type: 'users/saveForgetPwd',
      payload: { nowTime },
    });
  };

  // 清空表单
  handleReset = () => {
    const resetArr = ['verification', 'password', 'repeat_password'];
    const { login } = this.props;
    if (!login.adminData) {
      resetArr.push('phone');
    }
    this.props.form.resetFields(resetArr);
  };

  // 提交
  handleSubmit = e => {
    e.preventDefault();
    const { users, form, dispatch, login } = this.props;
    const { getFieldValue } = form;
    const { forgetTitle } = users.forgetPwd;
    const params = {
      captcha: getFieldValue('verification'),
      password: getFieldValue('password'),
      repeat_password: getFieldValue('repeat_password'),
    };
    if (forgetTitle === '登录') {
      params.phone = getFieldValue('phone');
      this.resetLoginPwdDispatch(params, () => {
        this.handleCancel();
        if (login.adminData) {
          Modal.success({
            title: '重置密码成功，请重新登录！',
            onOk() {
              dispatch(routerRedux.replace('/user/login'));
              dispatch({
                type: 'login/logout',
              });
            },
          });
        } else {
          message.success('密码重置成功！');
        }
      });
    } else {
      // 支付
      this.resetPayPwdEffectDispatch(params, this.handleCancel);
    }
  };

  render() {
    const { isAdmin } = this.state;
    const { loading, users, loadingSendMsg, login } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldsValue,
      getFieldValue,
      getFieldError,
    } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { showForgetModal, forgetTitle: title, hasSendMsg, clickTime, nowTime } = users.forgetPwd;
    const formHasError = Object.values(getFieldsError()).filter(item => item && item);
    const formsValue = Object.values(getFieldsValue()).filter(item => item && item);
    const hasEmptyValue = Object.keys(getFieldsValue()).length !== formsValue.length;
    return (
      <Modal
        title={`重置${title}密码`}
        visible={showForgetModal}
        // destroyOnClose
        onCancel={this.handleCancel}
        className="putPwdModal"
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} layout="horizontal">
          <FormItem label="手机号" {...formItemLayout}>
            {getFieldDecorator('phone', {
              rules: [
                { required: true, message: '请输入手机号' },
                {
                  validator: phone,
                },
              ],
            })(
              <Input
                onBlur={this.phoneBlur}
                onChange={this.phoneOnchange}
                disabled={!!login.adminData}
                placeholder="请输入手机号"
              />
            )}
          </FormItem>
          <FormItem label="验证码" {...formItemLayout}>
            <div className={styles.verificationCon}>
              {getFieldDecorator('verification', {
                rules: [{ required: true, message: '请输入验证码' }, { validator: verification }],
              })(<Input placeholder="请输入验证码" />)}
              <Button
                disabled={
                  !isAdmin || (hasSendMsg || !getFieldValue('phone') || getFieldError('phone'))
                }
                onClick={this.sendMsg}
                loading={loadingSendMsg}
                type="primary"
                className={styles.sendMsg}
              >
                {hasSendMsg ? `${msgCountDown - nowTime + clickTime}后重新发送` : '验证码'}
              </Button>
            </div>
          </FormItem>
          <FormItem label={`新${title}密码`} {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: `请输入新${title}密码` },
                {
                  validator: title === '支付' ? payPassword : password,
                },
              ],
            })(<Input type="password" placeholder={`请设置新${title}密码`} />)}
          </FormItem>
          <FormItem label={`重复${title}密码`} {...formItemLayout}>
            {getFieldDecorator('repeat_password', {
              rules: [
                { required: true, message: `请输入新${title}密码` },
                {
                  validator: compareToFirstPassword.bind(this),
                },
              ],
            })(<Input type="password" placeholder={`再次输入${title}密码`} />)}
          </FormItem>
          <FormItem className="text-center">
            <Button type="primary" className={styles['button-maegin']} onClick={this.handleCancel}>
              取 消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              // disabled={false}
              disabled={!!formHasError.length || hasEmptyValue}
              loading={loading.loadingSubmit}
              className={styles['button-margin']}
            >
              修 改
            </Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const ForgetPwdForm = Form.create()(ForgetPwd);
export default ForgetPwdForm;
