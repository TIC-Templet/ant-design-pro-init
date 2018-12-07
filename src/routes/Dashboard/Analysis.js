import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ dashboard, login }) => ({
  dashboard,
  login,
}))
export default class Analysis extends Component {
  state = {

  };

  componentWillMount() {

  }


render() {

    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '首页概况',
      },
    ];
    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
         首页
      </PageHeaderLayout>
    );
  }
}
