import { ElementHandle } from 'puppeteer';

/**
 * 根据一个选择器，到node中去找，找到之后，返回innerHTML
 *
 * @param {*} node
 * @param {*} selector
 */
export async function queryInnerHTML(node: ElementHandle, selector: string | string[]): Promise<string> {
  let resultStr = '';
  if (typeof selector == 'string' && selector != '') {
    // 单个选择器，选择元素，然后获取innerHTML
    let element = await node.$(selector);
    if (element != undefined) {
      resultStr = await elementHTML(element);
    }
  } else if (Array.isArray(selector)) {
    // 数组选择器
    if (selector.length == 1) {
      // 数组中只有一个选择器，表示使用selectAll，然后将所有元素的innerHTML拼起来
      let nodelist = await node.$$(selector[0]);
      let strList = await Promise.all(nodelist.map(async node => elementHTML(node)));
      return strList.join(' ');
    } else {
      //数组中有多个选择,递归每一项，然后拼起来
      let strList = await Promise.all(selector.map(async _selector => await queryInnerHTML(node, _selector)));
      resultStr = strList.join(' ');
    }
  }
  // 最后要把内容中的`&nbsp;`换成空格
  resultStr = resultStr.replace(/\&nbsp;/g, ' ');
  return resultStr || '';
}
export async function queryOuterHTML(node: ElementHandle, selector: string): Promise<string> {
  let resultStr = '';
  if (selector != '') {
    let element = await node.$(selector);
    if (element != undefined) {
      resultStr = await elementOuterHTML(element);
    }
  }
  return resultStr || '';
}

export async function queryInnerText(node: ElementHandle, selector: string): Promise<string> {
  let resultStr = '';
  if (selector != '') {
    // 单个选择器，选择元素，然后获取innerText
    let element = await node.$(selector);
    if (element != undefined) {
      resultStr = await elementText(element);
    }
  }
  return resultStr || '';
}

export async function elementHTML(el: ElementHandle): Promise<string> {
  let resultHandle = await el.executionContext().evaluateHandle((el: HTMLElement) => {
    return el.innerHTML;
  }, el);
  return await resultHandle.jsonValue();
}

export async function elementOuterHTML(el: ElementHandle): Promise<string> {
  let resultHandle = await el.executionContext().evaluateHandle((el: HTMLElement) => {
    return el.outerHTML;
  }, el);
  return await resultHandle.jsonValue();
}

export async function elementText(el: ElementHandle): Promise<string> {
  let resultHandle = await el.executionContext().evaluateHandle((el: HTMLElement) => {
    return el.innerText;
  }, el);
  return await resultHandle.jsonValue();
}

export function durationTime(start, end): string {
  let startHour = parseInt(start.split(':')[0]);
  let startMinute = parseInt(start.split(':')[1]);
  let endHour = parseInt(end.split(':')[0]);
  let endMinute = parseInt(end.split(':')[1]);
  let hours = endHour - startHour;
  let minutes = endMinute - startMinute;
  if (hours < 0) {
    // 如果结束的hour小于开始的hour，认为是第二天到达的（国内直飞不考虑隔2天）
    hours += 24;
  }
  if (minutes < 0) {
    // 如果结束minute小于开始minute，向hour借一位
    minutes += 60;
    hours -= 1;
  }
  return `${hours}h ${minutes}m`;
}

export function formatDate(date: Date, fmt: string = 'YYYY-MM-DD'): string {
  var o: any = {
    'M+': date.getMonth() + 1, //月份
    'D+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
  return fmt;
}
