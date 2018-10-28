import { queryInnerHTML, queryInnerText, durationTime } from '../util/util';
import { ElementHandle, Page } from 'puppeteer';
import { FlightInfo } from './flight-info';

/**
 * 中转航班
 */
export class StopFlightCreator {
  flightInfo: FlightInfo;
  page: Page;
  rootElement: ElementHandle;
  stopElement: ElementHandle;
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
  // onTime = '.service .direction_black_border';

  /**
   * 经停
   */
  stoppedCity = async node => {
    let cityName = await queryInnerHTML(node, '.center .stay-city .city-name');
    return '中转' + cityName;
  };

  /**
   * 中转停留时间
   */
  stopTime = '.center .stay-time';

  /**
   * 第一航班到达时间
   */
  flight1ArriveTime = async () => {
    return queryInnerText(this.stopElement, '.first_half .arrive-time');
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
  flight1OnTime = async node => {
    return queryInnerText(node, '.service .clearfix');
  };
  /**
   * 第一航班飞行时间
   */
  flight1Duration = async () => {
    let start = await queryInnerText(this.stopElement, '.first_half .depart-time');
    let end = await queryInnerText(this.stopElement, '.first_half .arrive-time');
    return durationTime(start, end);
  };

  /**
   * 第二航班起飞时间
   */
  flight2StartTime = async () => {
    let start = await queryInnerText(this.stopElement, '.second_half .depart-time');
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
  flight2OnTime = async node => {
    return queryInnerText(node, '.service .clearfix:last-child');
  };
  /**
   * 第二航班飞行时间
   */
  flight2Duration = async () => {
    let start = await queryInnerText(this.stopElement, '.second_half .depart-time');
    let end = await queryInnerText(this.stopElement, '.second_half .arrive-time');
    return durationTime(start, end);
  };

  constructor(root: ElementHandle, page: Page) {
    if (root == undefined) {
      return;
    }
    this.rootElement = root;
    this.page = page;
  }

  async createFlightInfo() {
    let popHandler = await this.rootElement.$('.inb.center');
    await popHandler.hover();
    await this.page.waitFor(100);
    this.stopElement = await this.page.$('.layer-wrapper');
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

    await this.page.mouse.move(0, 0);
    await this.page.waitFor(100);
    return this.flightInfo;
  }
}
