import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

export default class MyTable extends PureComponent {
  render() {
    const { columns, dataSource, rowKey, loading, pagination, style } = this.props;
    return (
      <Table
        className={styles.myTable}
        style={style}
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        loading={loading}
        pagination={{
          ...pagination,
          hideOnSinglePage: true,
        }}
        scroll={{ x: 1 | true, y: 0 }}
        rowClassName={styles.myTableRow}
      />
    );
  }
}
