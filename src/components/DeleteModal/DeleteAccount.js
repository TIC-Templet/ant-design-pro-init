import React, { Component } from 'react';
import { Modal, Input } from 'antd';
import { connect } from 'dva';
import { password } from 'utils/validator';
import styles from './css/index.less';

@connect(({ users, loading }) => ({
  users,
  loading,
}))
export default class DeleteAccount extends Component {
  state = {
    pswValue: '',
    errorTip: '',
  };

  // 点击删除用户modal面板确定按钮
  handleOk = () => {
    const { pswValue } = this.state;
    let errorTip = '';
    password('', pswValue, value => {
      errorTip = value;
    });
    if (errorTip) return this.setState({ errorTip });
    if (!pswValue) return null;
    const { submitAction } = this.props;
    submitAction(pswValue, () => {
      this.setState({ errorTip: '', pswValue: '' });
    });
  };

  // 点击删除用户modal面板取消按钮
  handleCancel = () => {
    const { cancelFun } = this.props;
    cancelFun('visible');
    this.setState({
      errorTip: '',
      pswValue: '',
    });
  };

  // 获取密码
  changePswValue = e => {
    this.setState({
      errorTip: '',
      pswValue: e.target.value,
    });
  };

  render() {
    const { title, visible, modalText, loading } = this.props;
    const { pswValue, errorTip } = this.state;
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={loading.global}
        onCancel={this.handleCancel}
      >
        <p>{modalText}</p>
        <Input
          onChange={this.changePswValue}
          value={pswValue}
          type="password"
          placeholder="请输入登录密码"
        />
        <span className={styles.errorTips}>{errorTip}</span>
      </Modal>
    );
  }
}
