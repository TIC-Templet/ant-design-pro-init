import React from 'react';
import { Tooltip } from 'antd';

/**
 * 没有小数点的，直接返回
 * 小数点长度小于10位的，直接返回
 * 小数点长度大于10位的，用ToolTip包裹，并显示前10位...
 */
export default function ToolTip(text) {
  const splitArr = text.split('.');
  if (splitArr.length > 1) {
    if (splitArr[1].length < 11) return text;
    return (
      <Tooltip title={text}>
        <span>{`${splitArr[0]}.${splitArr[1].slice(0, 10)}...`}</span>
      </Tooltip>
    );
  }
  return text;
}
