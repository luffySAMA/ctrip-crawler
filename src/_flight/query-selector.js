/**
 * 根据一个选择器，到node中去找，找到之后，返回innerHTML
 *
 * @param {*} node
 * @param {*} selector
 */
function querySelector(node, selector) {
  let resultStr = '';
  if (typeof selector == 'string' && selector != '') {
    // 单个选择器，选择元素，然后获取innerHTML
    let element = node.querySelector(selector);
    if (element != undefined) {
      resultStr = element.innerHTML;
    }
  } else if (Array.isArray(selector)) {
    // 数组选择器
    if (selector.length == 1) {
      // 数组中只有一个选择器，表示使用selectAll，然后将所有元素的innerHTML拼起来
      let nodelist = node.querySelectorAll(selector);
      // nodelist 转数组
      let elements = Array.prototype.slice.call(nodelist);
      resultStr = elements.map(element => element.innerHTML).join(' ');
    } else {
      //数组中有多个选择,递归每一项，然后拼起来（ps:暂时没有用到这种情况）
      resultStr = selector.map(_selector => querySelector(node, _selector)).join(' ');
    }
  } else if (typeof selector == 'function') {
    return selector(node);
  } else if (typeof selector == 'object') {
    // 选择器是对象类型
    // 不太好处理，先不处理这种情况吧
    // 对象类型的选择器，需要特殊处理
    resultStr = '';
  }
  // 最后要把内容中的`&nbsp;`换成空格
  resultStr = resultStr.replace(/\&nbsp;/g, ' ');
  return resultStr || '';
}
