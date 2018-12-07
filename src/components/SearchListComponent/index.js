import React, { PureComponent } from 'react';
import { Input, Button } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export default class extends PureComponent {
  state = {
    searchInputValue: '',
  };

  changeSearchInputValue = e => {
    this.setState({ searchInputValue: e.target.value });
  };

  submitFilter = () => {
    const { submitFilter = () => {} } = this.props;
    const { searchInputValue } = this.state;
    submitFilter(searchInputValue);
  };

  resetFilter = () => {
    const { submitFilter = () => {} } = this.props;
    this.setState({ searchInputValue: '' });
    submitFilter();
  };

  render() {
    const { searchInputValue } = this.state;
    const { className, placeholder } = this.props;
    return (
      <div className={classNames(styles.filterCon, className)}>
        <Input
          onChange={this.changeSearchInputValue}
          value={searchInputValue}
          className={styles.filterInput}
          placeholder={placeholder}
        />
        <Button onClick={this.submitFilter} type="primary" className={styles.filterBtn}>
          搜索
        </Button>
        <Button onClick={this.resetFilter} type="primary" className={styles.filterBtn}>
          重置
        </Button>
      </div>
    );
  }
}
