import React, { Component } from 'react';
import { Modal, Form, Button, Input } from 'antd';
import { connect } from 'dva';
import { password, compareToFirstPassword, payPassword } from '../../utils/validator';
import styles from './css/index.less';

const FormItem = Form.Item;

@connect(({ users, loading }) => ({
  users,
  loading,
}))
class PutPwd extends Component {
  state = {
    confirmLoading: false,
  };

  // 取消
  handleCancel = () => {
    const { cancelFun, value } = this.props;
    cancelFun(value);
    this.setState({
      confirmLoading: false,
    });
    this.handleReset();
  };

  // 修改密码
  handleSubmit = e => {
    e.preventDefault();
    const { okFun } = this.props;
    const pwdThis = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        okFun(values.old_password, values.password, values.repeat_password, pwdThis.handleCancel);
      }
    });
  };

  // 显示重置密码modal
  forgetPwd = () => {
    const { dispatch, cancelFun, title, value, setForgetPwdValue } = this.props;
    cancelFun(value);
    dispatch({
      type: 'users/saveForgetPwd',
      payload: { show: true, title, callback: setForgetPwdValue },
    });
  };

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { title, visible, loading, maskClosable = true, self } = this.props;
    let { type } = this.props;
    if (!type) {
      type = 1;
    }
    const { confirmLoading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const isSetPwd = type === '0';
    return (
      <Modal
        title={isSetPwd ? `设置支付密码` : `修改${title}密码`}
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}
        maskClosable={maskClosable}
        className="putPwdModal"
        // footer={<span>忘记登录密码</span>}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} layout="horizontal">
          {self && (
            <FormItem label={`原${title}密码`} {...formItemLayout}>
              {getFieldDecorator('old_password', {
                rules: [
                  { required: true, message: `请输入原${title}密码` },
                  {
                    validator: title === '支付' ? payPassword : password,
                  },
                ],
              })(<Input type="password" placeholder={`请输入原${title}密码`} />)}
            </FormItem>
          )}
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
          <FormItem label={`再次输入${title}密码`} {...formItemLayout}>
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
              loading={loading.global}
              className={styles['button-maegin']}
            >
              {isSetPwd ? '设置' : '修 改'}
            </Button>
            {!isSetPwd && (
              <a className={styles.forgetPwd} onClick={this.forgetPwd}>
                忘记{title}密码
              </a>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const PutPwdForm = Form.create()(PutPwd);
export default PutPwdForm;
