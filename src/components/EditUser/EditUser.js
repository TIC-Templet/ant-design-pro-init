import React, { Component, Fragment } from 'react';
import { Modal, Form, Button, Input } from 'antd';
import { connect } from 'dva';
import { phone, nickName, email } from '../../utils/validator';
import styles from './css/index.less';

const FormItem = Form.Item;

@connect(({ users, loading }) => ({
  users,
  loading,
}))
class EditUser extends Component {
  // 取消
  handleCancel = () => {
    const { cancelFun, value } = this.props;
    cancelFun(value);
    this.handleReset();
  };

  // 修改信息
  handleSubmit = e => {
    e.preventDefault();
    const { okFun, userDetail } = this.props;
    const pwdThis = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        okFun(
          userDetail.phone === values.phone ? null : values.phone,
          userDetail.email === values.email ? null : values.email,
          userDetail.nikename === values.nickName ? null : values.nickName,
          pwdThis.handleCancel
        );
      }
    });
  };

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { title, visible, userDetail, type, loading } = this.props;
    // const { phone, email, nickName } = userDeatil;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const editPhone = type === 'phone';
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit} layout="horizontal">
          <FormItem label="手机号" {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: userDetail.phone,
              rules: [
                { required: false, message: '请输入手机号' },
                {
                  validator: phone,
                },
              ],
            })(<Input placeholder="请输入手机号" />)}
          </FormItem>
          {!editPhone && (
            <Fragment>
              <FormItem label="邮箱" {...formItemLayout}>
                {getFieldDecorator('email', {
                  initialValue: userDetail.email,
                  rules: [
                    { required: false, message: '请输入邮箱地址' },
                    {
                      validator: email,
                    },
                  ],
                })(<Input placeholder="请输入邮箱地址" />)}
              </FormItem>
              <FormItem label="用户名" {...formItemLayout}>
                {getFieldDecorator('nickName', {
                  initialValue: userDetail.nikename,
                  rules: [
                    { required: false, message: '请输入用户名' },
                    {
                      validator: nickName,
                    },
                  ],
                })(<Input placeholder="请输入用户名" />)}
              </FormItem>
            </Fragment>
          )}

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
              修 改
            </Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const EditUserForm = Form.create()(EditUser);
export default EditUserForm;
