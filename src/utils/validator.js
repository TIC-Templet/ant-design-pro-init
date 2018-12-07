export function account(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  if (value.length < 4 || value.length > 20) {
    callback('帐号长度不能小于4字符或大于20字符');
    return;
  }
  const reg = /^(?![_0-9])(?!.*?_$)[a-zA-Z0-9_]{4,20}$/;
  if (!reg.test(value)) {
    callback('帐号不能含有特殊字符与中文，不能以下划线、数字开头和下划线结尾');
  } else {
    callback();
  }
}

export function verification(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  const reg = /^\d{6}$/;
  if (!reg.test(value)) {
    callback('验证码是6位数字');
  } else {
    callback();
  }
}

export function phone(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  const reg = /^0?(13|14|15|17|18|19)[0-9]{9}$/;
  if (!reg.test(value)) {
    callback('请输入正确手机号');
  } else {
    callback();
  }
}

export function password(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
  if (!reg.test(value)) {
    callback('密码最少包含一个字母、数字，密码长度6-20');
  } else {
    callback();
  }
}

export function payPassword(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  const reg = /^\d{6}$/;
  if (!reg.test(value)) {
    callback('支付密码只能为6位数字');
  } else {
    callback();
  }
}

export function compareToFirstPassword(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  const { form } = this.props;
  if (value && value !== form.getFieldValue('password')) {
    callback('您输入的两次密码不一致。');
  } else {
    callback();
  }
}

export function IDname(rule, value, callback) {
  if (value === '' || value === undefined) {
    callback();
    return;
  }
  if (value.length < 2 || value.length > 20) {
    callback('姓名长度不能小于2字符或大于20字符');
    return;
  }
  callback();
}

export function IDNo(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  const reg1 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  const reg2 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/;
  if (!reg1.test(value) && !reg2.test(value)) {
    callback('请检查身份证号码是否正确');
    return;
  }
  callback();
}

export function email(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  const reg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/;
  if (!reg.test(value)) {
    callback('请输入正确的邮箱地址');
  } else {
    callback();
  }
}

export function nickName(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  const reg = /^[\w\u4e00-\u9fa5]{2,20}$/;
  if (!reg.test(value)) {
    callback('昵称只能包含字母，中文，数字，下划线，昵称长度2-20');
  } else {
    callback();
  }
}

export function url(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  const reg = /(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/;
  if (!reg.test(value)) {
    callback('url格式错误');
  } else {
    callback();
  }
}
