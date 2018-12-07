import moment from 'moment';
import md5 from 'md5';
import nonce from 'nonce';
import { parse, stringify } from 'qs';
import { BigNumber } from 'bignumber.js';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatTime(value) {
  return moment(value).format('YYYY-MM-DD HH:mm:ss');
}

// add by syi
// 获取当前如下格式时间  2018-02-04 14:34:45
// 小写h表示12小时制 大写H表示24小时制
export function getFormatTime() {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

// 重放攻击验证 timestamp nonce sign
export function replayAttackVerification(url) {
  const n = nonce();
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  const nonced = n();
  const psw = localStorage.getItem('cql');
  const sign = md5(`${psw}${timestamp}${nonced}`);
  const isNoQuery = url.indexOf('?') < 0;
  return `${url}${isNoQuery ? '?' : '&'}timestamp=${timestamp}&nonce=${nonced}&sign=${sign}`;
}

export function getParamsString(params) {
  let paramsString = '';
  const paramsArr = Object.keys(params);
  const lastOneIndex = paramsArr.length - 1;
  paramsArr.map((item, index) => {
    paramsString += `${item}=${params[item]}${index === lastOneIndex ? '' : '&'}`;
    return paramsString;
  });
  return paramsString;
}

export function bnToString(value) {
  return BigNumber(value).toString(10);
}

export function minusDecimal(value, decimalNum = 18) {
  const decimal = BigNumber('10').pow(BigNumber(`${decimalNum}`));
  return BigNumber(value)
    .div(decimal)
    .toString(10);
}

export function plusDecimal(value, decimalNum) {
  const decimal = BigNumber('10').pow(BigNumber(`${decimalNum}`));
  return BigNumber(value)
    .multipliedBy(decimal)
    .toString(10);
}

// 两个数相除
export function bignumDiv(value1, value2) {
  return BigNumber(value1)
    .dividedBy(BigNumber(value2))
    .toString(10);
}

// toFixed
export function bignumToFixed(value, flag = false, decimal = 7) {
  const flaged = !flag ? 1 : 0; // 1 表示不四舍五入
  const valued = value.toString();
  if (valued.indexOf('.') !== -1 && valued.split('.')[1].length > decimal) {
    return BigNumber(value).toFixed(decimal, flaged);
  }
  return value;
}

/**
 * 删除两个数组中重复的元素，返回一个新的数组
 */
export function clearRepeatArr(arr, repeatArr, key) {
  const tempArr1 = [];
  const tempArr2 = [];
  let itemIsObject = false;

  if (!Array.isArray(arr)) return console.log('arr不是数组');
  if (!Array.isArray(repeatArr)) return console.log('repeatArr不是数组');

  // 将数repeatArr 中的元素值作为tempArr1 中的键，值为true；
  repeatArr.map((item, index) => {
    if (typeof item === 'object') {
      itemIsObject = true;
      if (!key) return console.log('请传入key值');
      return (tempArr1[repeatArr[index][key]] = true);
    } else {
      return (tempArr1[repeatArr[index]] = true);
    }
  });

  if (itemIsObject && !key) return [];
  // 过滤arr 中与repeatArr 相同的元素；
  arr.map((item, index) => {
    if (itemIsObject) {
      if (!tempArr1[arr[index][key]]) {
        return tempArr2.push(arr[index]);
      }
    } else if (!tempArr1[arr[index]]) {
      return tempArr2.push(arr[index]);
    }
    return null;
  });

  return tempArr2;
}

export function clearRepeatArr2(arr, repeatArr) {
  const setRepeatArr = new Set(repeatArr);
  return arr.filter(item => !setRepeatArr.has(item));
}

// 删除指定index的item，返回一个新数组,不改变原数组
export function removeArrIndex(arr, index) {
  const arrBackups = arr;
  arr = arrBackups.slice(0, index);
  arr = arr.concat(arrBackups.slice(index + 1));
  return arr;
}

// 取url地址参数
export function getParameter(param) {
  const query = window.location.search || window.location.hash;
  const iLen = param.length;
  let iStart = query.indexOf(param);
  if (iStart === -1) return '';
  iStart += iLen + 1;
  const iEnd = query.indexOf('&', iStart);

  if (iEnd === -1) return query.substring(iStart);
  return query.substring(iStart, iEnd);
}

// 判断当前用户是否是超级管理员
export function isSuperAdmin(loginModel) {
  const currentRole = loginModel.adminData.roles.toString();
  const superAdmin = currentRole.indexOf('root') > -1;
  return superAdmin;
}

// 从localstorage取出解密后的adminData
export function storageAdminData() {
  const storage = localStorage.getItem('user');
  const adminData = JSON.parse(uncompile(storage));
  return adminData;
}

// 修改localstorage中的adminData
export function editStorageData(edit) {
  const adminData = storageAdminData();
  const copyData = { ...adminData, ...edit };
  localStorage.setItem('user', compile(JSON.stringify(copyData)));
}

// 过滤出普通管理员列表
export function filterCommonAdmin(adminList) {
  const commonAdmin = adminList.filter(item => item.roles.toString().indexOf('root') < 0);
  return commonAdmin;
}

// 简单的加密解密方法
export function compile(code) {
  let c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for (let i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  }
  return escape(c);
}
export function uncompile(code) {
  code = unescape(code);
  let c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for (let i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
}
