import { queryInnerHTML, queryInnerText, durationTime, queryOuterHTML } from '../util/util';
import { ElementHandle } from 'puppeteer';
import { FlightInfo } from './flight-info';

/**
 * 中转航班
 */
export class StopFlightCreator {
  flightInfo: FlightInfo;
  rootElement: ElementHandle;
  stopElement: ElementHandle;
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
    let end = await queryInnerHTML(node, '.left .time');
    return durationTime(start, end);
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
  // this.onTime = '.service span[data-bit="OnTimeRate"]';

  /**
   * 经停
   */
  stoppedCity = async node => {
    let cityName = await queryInnerHTML(node, '.J_trans_pop .stay-city .city-name');
    return '中转' + cityName;
  };

  /**
   * 中转停留时间
   */
  stopTime = '.J_trans_pop .stay-time';

  /**
   * 第一航班到达时间
   */
  flight1ArriveTime = async () => {
    let end = await queryInnerHTML(this.stopElement, '.first_half .arrive-time');
    let endSpan = await queryOuterHTML(this.stopElement, '.first_half .arrive-time span');
    end = end.replace(endSpan, '');
    return end;
  };
  /**
   * 第一航班到达机场
   */
  flight1ArriveAddress = () => {
    let selector = '.first_half .arrive-airport';
    return queryInnerHTML(this.stopElement, selector);
  };
  /**
   * 第一航班准点率
   */
  flight1OnTime = '.service span[data-bit="OnTimeRate"]';
  /**
   * 第一航班飞行时间
   */
  flight1Duration = async () => {
    let start = await queryInnerHTML(this.stopElement, '.first_half .depart-time');
    let startSpan = await queryOuterHTML(this.stopElement, '.first_half .depart-time span');
    start = start.replace(startSpan, '');
    let end = await queryInnerHTML(this.stopElement, '.first_half .arrive-time');
    let endSpan = await queryOuterHTML(this.stopElement, '.first_half .arrive-time span');
    end = end.replace(endSpan, '');
    return durationTime(start, end);
  };

  /**
   * 第二航班起飞时间
   */
  flight2StartTime = async () => {
    let start = await queryInnerHTML(this.stopElement, '.second_half .depart-time');
    let startSpan = await queryOuterHTML(this.stopElement, '.second_half .depart-time span');
    start = start.replace(startSpan, '');
    return start;
  };
  /**
   * 第二航班起飞机场
   */
  flight2StartAddress = async () => {
    let selector = '.second_half .depart-airport';
    return queryInnerHTML(this.stopElement, selector);
  };
  /**
   * 第二航班准点率
   */
  flight2OnTime = '.service span[data-bit="OnTimeRate"]:last-child';
  /**
   * 第二航班飞行时间
   */
  flight2Duration = async () => {
    let start = await queryInnerHTML(this.stopElement, '.second_half .depart-time');
    let startSpan = await queryOuterHTML(this.stopElement, '.second_half .depart-time span');
    start = start.replace(startSpan, '');
    let end = await queryInnerHTML(this.stopElement, '.second_half .arrive-time');
    let endSpan = await queryOuterHTML(this.stopElement, '.second_half .arrive-time span');
    end = end.replace(endSpan, '');
    return durationTime(start, end);
  };

  constructor(root: ElementHandle, stopElement: ElementHandle) {
    if (root == undefined) {
      return;
    }
    this.rootElement = root;
    this.stopElement = stopElement;
  }

  async createFlightInfo() {
    this.flightInfo = new FlightInfo();
    for (let propName in this.flightInfo) {
      // this.propName 存的值是选择器
      let selector = this[propName];
      // 用selector到this.root中去找，返回的就是航班的信息
      if (typeof selector === 'string' || Array.isArray(selector)) {
        this.flightInfo[propName] = await queryInnerHTML(this.rootElement, selector);
      } else if (typeof selector === 'function') {
        this.flightInfo[propName] = await selector(this.rootElement);
      }
    }
    return this.flightInfo;
  }
}
