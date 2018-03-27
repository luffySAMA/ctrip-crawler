import { FlightInfo } from './flight-info';
import { queryInnerHTML, queryInnerText } from '../util/util';
import { ElementHandle } from 'puppeteer';

/**
 * 直飞航班
 */
export class DirectFlightCreator {
  flightInfo: FlightInfo;
  rootElement: ElementHandle;
  constructor(root: ElementHandle) {
    this.rootElement = root;
    this.flightInfo = new FlightInfo();
  }

  /**
   * 起飞机场
   */
  fromAirport = '.right div+div';
  /**
   * 到达机场
   */
  toAirport = '.left div+div';
  /**
   * 航空公司
   */
  airline = '.logo .flight_logo';
  /**
   * 航班编号
   */
  flightNum = '.logo .flight_logo+span';
  /**
   * 机型
   */
  airplane = '.logo .craft';
  /**
   * 计划起飞时间
   */
  startTime = '.right .time';
  /**
   * 计划到达时间
   */
  endTime = '.left .time';
  /**
   * 总飞行时长
   */
  duration = async node => {
    let start = await queryInnerHTML(node, '.right .time');
    let startHour = parseInt(start.split(':')[0]);
    let startMinute = parseInt(start.split(':')[1]);
    let end = await queryInnerHTML(node, '.left .time');
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
  };
  /**
   * 经济舱价格
   */
  priceEconomy = async node => {
    return queryInnerText(node, '.price .base_price02');
  };
  /**
   * 商务舱价格
   */
  priceBusiness = '';
  /**
   * 头等舱价格
   */
  priceFirst = '';
  /**
   * 准点率
   */
  onTime = '.service span[data-bit="OnTimeRate"]';
  /**
   * 经停
   */
  stoppedCity = async node => {
    let temp = await queryInnerHTML(node, '.stopover .low_text');
    // 去掉<br>
    temp = temp.substring(0, temp.length - 4);
    return temp.length > 0 ? '经停' + temp : '';
  };

  async createFlightInfo(): Promise<FlightInfo> {
    this.flightInfo = new FlightInfo();
    for (let propName in this.flightInfo) {
      // this.propName 存的值是选择器
      let selector = this[propName];
      // 用selector到this.root中去找，返回的就是航班的信息
      if (typeof selector === 'string') {
        this.flightInfo[propName] = await queryInnerHTML(this.rootElement, selector);
      } else if (typeof selector === 'function') {
        this.flightInfo[propName] = await selector(this.rootElement);
      }
    }
    return this.flightInfo;
  }
}
