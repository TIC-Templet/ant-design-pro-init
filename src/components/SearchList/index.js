import React, { PureComponent } from 'react';
import { Input, Select, Button } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const { Option } = Select;

export default class extends PureComponent {
  state = {
    searchInputValue: '',
    selectedIndex: 3,
  };

  changeStatus = value => {
    this.setState({ selectedIndex: value });
  };

  changeSearchInputValue = e => {
    this.setState({ searchInputValue: e.target.value });
  };

  submitFilter = () => {
    const { submitFilter } = this.props;
    const { searchInputValue, selectedIndex } = this.state;
    submitFilter(searchInputValue, selectedIndex);
  };

  render() {
    const { searchInputValue } = this.state;
    const { className } = this.props;
    return (
      <div className={classNames(styles.filterCon, className)}>
        <Input
          onChange={this.changeSearchInputValue}
          value={searchInputValue}
          className={styles.filterInput}
          placeholder="订单编号/用户ID/操作人/币种名称/币种地址/转入地址"
        />
        <div className={styles.filterSelect}>
          <Select
            dropdownMatchSelectWidth={false}
            onChange={this.changeStatus}
            defaultValue="全部状态"
          >
            <Option value="3">全部状态</Option>
            <Option value="2">交易成功</Option>
            <Option value="-1">交易失败</Option>
            <Option value="1">处理中　</Option>
            <Option value="0">准备中　</Option>
          </Select>
        </div>
        <Button onClick={this.submitFilter} type="primary" className={styles.filterBtn}>
          搜索
        </Button>
      </div>
    );
  }
}
