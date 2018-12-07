import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';
import { minusDecimal, bignumToFixed } from 'utils/utils';
import { BigNumber } from 'bignumber.js';

export default class TimelineChart extends React.Component {
  render() {
    const { data } = this.props;
    const dataArray = Object.keys(data);
    const chartData = [];
    if (dataArray.length > 0) {
      data[dataArray[0]].forEach((item, index) => {
        const temp = {
          day: item.date,
        };
        dataArray.forEach(item1 => {
          const value = bignumToFixed(
            minusDecimal(data[item1][index].amount, data[item1][index].decimal || 18),
            false,
            0
          );
          temp[item1] = new BigNumber(value).toNumber();
        });
        chartData.push(temp);
      });
    }
    console.log(chartData);
    const ds = new DataSet();
    const dv = ds.createView().source(chartData);
    dv.transform({
      type: 'fold',
      fields: dataArray,
      // 展开字段集
      key: 'type',
      // key字段
      value: 'count', // value字段
    });
    const countObject = {
      recharge: '充币',
      turnout: '提币',
    };
    dv.transform({
      type: 'map',
      callback(row) {
        // 加工数据后返回新的一行，默认返回行数据本身
        if (countObject[row.type]) {
          row.type = countObject[row.type];
        }
        return row;
      },
    });
    const cols = {
      day: {},
      recharge: {
        alias: '充币',
        value: '充币',
      },
    };
    return (
      <div>
        <Chart
          height={500}
          data={dv}
          scale={cols}
          padding={{ top: 30, right: 40, bottom: 80, left: 80 }}
          forceFit
        >
          <Legend />
          <Axis name="day" />
          <Axis
            name="count"
            label={{
              formatter: val => `${val}`,
            }}
          />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="line" position="day*count" size={2} color="type" />
          <Geom type="point" position="day*count" size={4} shape="circle" color="type" />
        </Chart>
      </div>
    );
  }
}
