import React from 'react';
import { Input, Icon } from 'antd';
import { verification } from 'utils/validator';
import styles from './index.less';

const map = {
  UserName: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
    },
    rules: [
      {
        required: true,
        message: '请输入登录账号!',
      },
    ],
  },
  Password: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
    },
    rules: [
      {
        required: true,
        message: '请输入登录密码!',
      },
      {
        min: 6,
        message: '密码至少6位!',
      },
    ],
  },
  Captcha: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: '请输入验证码',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码!',
      },
      {
        validator: verification,
      },
    ],
  },
};

export default map;
