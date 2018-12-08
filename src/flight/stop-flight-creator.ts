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
    return queryInnerText(this.stopElement, '.first_half .flight_logo');
  };
  /**
   * 航班编号
   */
  flightNum = async => {
    return queryInnerText(this.stopElement, '.first_half .flight_logo+span');
  }
  /**
   * 机型
   */
  airplane = async node => {
    return queryInnerText(node, '.logo .low_text');
  };
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
    start = start.replace(/.*天/, '');
    let end = await queryInnerHTML(node, '.left .time');
    end = end.replace(/.*天/, '');
    let night: any = await queryInnerHTML(node, '.left .c-react-frame');
    night = night ? parseInt(night) : 0;
    return durationTime(start, end, night);
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
    start = start.replace(/.*天/, '');
    let end = await queryInnerText(this.stopElement, '.first_half .arrive-time');
    end = end.replace(/.*天/, '');
    let night: any = await queryInnerHTML(this.stopElement, '.first_half .arrive-time .c-react-frame');
    night = night ? parseInt(night) : 0;
    return durationTime(start, end, night);
  };
  /**
   * 第二航班航空公司
   */
  flight2Airline = async () => {
    return queryInnerText(this.stopElement, '.second_half .flight_logo');
  };
  /**
   * 第二航班航班编号
   */
  flight2FlightNum = async () => {
    return queryInnerText(this.stopElement, '.second_half .flight_logo+span');
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
    start = start.replace(/.*天/,'');
    let end = await queryInnerText(this.stopElement, '.second_half .arrive-time');
    end = end.replace(/.*天/, '');
    let night: any = await queryInnerHTML(this.stopElement, '.second_half .arrive-time .c-react-frame');
    night = night ? parseInt(night) : 0;
    return durationTime(start, end, night);
  };

  constructor(root: ElementHandle, page: Page) {
    if (root == undefined) {
      return;
    }
    this.rootElement = root;
    this.page = page;
  }

  async createFlightInfo() {
    let popHandler = await this.rootElement.$('.center');
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
      } else {
        this.flightInfo[propName] = '';
      }
    }

    await this.page.mouse.move(10, 10);
    await this.page.waitFor(100);
    return this.flightInfo;
  }
}
