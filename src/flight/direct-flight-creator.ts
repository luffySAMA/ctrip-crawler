import { FlightInfo } from './flight-info';
import { queryInnerHTML, queryInnerText, durationTime } from '../util/util';
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
  fromAirport = '.right .airport';
  /**
   * 到达机场
   */
  toAirport = '.left .airport';
  /**
   * 航空公司
   */
  airline = async node => {
    return queryInnerText(node, '.logo .flight_logo strong');
  };
  /**
   * 航班编号
   */
  flightNum = '.logo .flight_logo strong+span';
  /**
   * 机型
   */
  airplane = '.logo .low_text';
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
  onTime = async node => {
    return queryInnerText(node, '.service .clearfix');
  };

  /**
   * 经停
   */
  stoppedCity = async node => {
    return queryInnerText(node, '.stopover');
  };

  async createFlightInfo(): Promise<FlightInfo> {
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
