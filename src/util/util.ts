import { ElementHandle } from 'puppeteer';

/**
 * 根据一个选择器，到node中去找，找到之后，返回innerHTML
 *
 * @param {*} node
 * @param {*} selector
 */
export async function queryInnerHTML(node: ElementHandle, selector: string | string[]): Promise<string> {
  try {
    if (node == undefined) {
      return '';
    }
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
  } catch (error) {
    return '';
  }
}
export async function queryOuterHTML(node: ElementHandle, selector: string): Promise<string> {
  try {
    if (node == undefined) {
      return '';
    }
    let resultStr = '';
    if (selector != '') {
      let element = await node.$(selector);
      if (element != undefined) {
        resultStr = await elementOuterHTML(element);
      }
    }
    return resultStr || '';
  } catch (error) {
    return '';
  }
}

export async function queryInnerText(node: ElementHandle, selector: string | string[]): Promise<string> {
  try {
    if (node == undefined) {
      return '';
    }
    let resultStr = '';
    if (typeof selector == 'string') {
      if (selector != '') {
        // 单个选择器，选择元素，然后获取innerText
        let element = await node.$(selector);
        if (element != undefined) {
          resultStr = await elementText(element);
        }
      }
    } else if (Array.isArray(selector)) {
      //数组中有多个选择,递归每一项，然后拼起来
      let strList = await Promise.all(selector.map(async _selector => await queryInnerText(node, _selector)));
      resultStr = strList.join(' ');
    }
    return resultStr || '';
  } catch (error) {
    return '';
  }
}

export async function elementHTML(el: ElementHandle): Promise<string> {
  try {
    return await el.executionContext().evaluate((el: HTMLElement) => {
      return el.innerHTML;
    }, el);
  } catch (error) {
    return '';
  }
}

export async function elementOuterHTML(el: ElementHandle): Promise<string> {
  try {
    return await el.executionContext().evaluate((el: HTMLElement) => {
      return el.outerHTML;
    }, el);
  } catch (error) {
    return '';
  }
}

export async function elementText(el: ElementHandle): Promise<string> {
  try {
    return await el.executionContext().evaluate((el: HTMLElement) => {
      return el.innerText;
    }, el);
  } catch (error) {
    return '';
  }
}

export function durationTime(start, end, night = 0): string {
  try {
    let startHour = parseInt(start.split(':')[0]);
    let startMinute = parseInt(start.split(':')[1]);
    let endHour = parseInt(end.split(':')[0]);
    let endMinute = parseInt(end.split(':')[1]);
    let hours = endHour - startHour + night * 24;
    let minutes = endMinute - startMinute;
    if (minutes < 0) {
      // 如果结束minute小于开始minute，向hour借一位
      minutes += 60;
      hours -= 1;
    }
    if(hours > 24){
      let days = Math.floor(hours / 24)
      hours =  hours % 24;
      return `${days}天${hours}小时${minutes}分`
    }
    return `${hours}小时${minutes}分`;
  } catch (error) {
    return '';
  }
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
