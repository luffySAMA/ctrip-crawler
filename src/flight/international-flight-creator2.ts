import { ElementHandle, Page } from 'puppeteer';
import { FlightInfo } from './flight-info';
import { queryInnerText } from '../util/util';
/**
 * 国际航班
 */
export class InternationalFlightCreator2 {
  page: Page;
  flightInfo: FlightInfo;
  rootElement: ElementHandle;
  popElement: ElementHandle;
  /**
   * 起飞机场
   */
  fromAirport = async (node: ElementHandle) => {
    let selector = '.depart-box .airport';
    return await queryInnerText(node, selector);
  };
  /**
   * 到达机场
   */
  toAirport = async (node: ElementHandle) => {
    let selector = '.arrive-box .airport';
    return await queryInnerText(node, selector);
  };
  /**
   * 航空公司
   */
  airline = async (node: ElementHandle) => {
    let selector = '.airline-name';
    return await queryInnerText(node, selector);
  };
  /**
   * 航班编号
   */
  flightNum = async (node: ElementHandle) => {
    let selector = '.plane-No';
    let flightNo = await queryInnerText(node, selector);
    if (flightNo != undefined && flightNo.split(' ').length > 0) {
      return flightNo.split(' ')[0];
    } else {
      return '';
    }
  };
  /**
   * 机型
   */
  airplane = async (node: ElementHandle) => {
    let selector = '.plane-No';
    let flightNo = await queryInnerText(node, selector);
    if (flightNo != undefined && flightNo.split(' ').length > 1) {
      return flightNo.split(' ')[1];
    } else {
      return '';
    }
  };
  /**
   * 计划起飞时间
   */
  startTime = '.depart-box .time';
  /**
   * 计划到达时间
   */
  endTime = '.arrive-box .time';
  /**
   * 总飞行时长
   */
  duration = '.flight-consume';
  /**
   * 经济舱价格
   */
  priceEconomy = '.price';
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
  onTime = '';
  /**
   * 经停
   */
  stoppedCity = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, ['.each-box:nth-child(1) .transfer-info .prompt', '.each-box:nth-child(1) .transfer-info .city']);
  };

  /**
   * 中转停留时间
   */
  stopTime = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(1) .transfer-info .hint');
  };

  /**
   * 第一航班到达时间
   */
  flight1ArriveTime = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(1) .transfer .time');
  };
  /**
   * 第一航班到达机场
   */
  flight1ArriveAddress = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(1) .transfer .airport');
  };
  /**
   * 第一航班准点率
   */
  flight1OnTime = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(1) .extra .extra-text');
  };
  /**
   * 第一航班飞行时间
   */
  flight1Duration = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(1) .extra .consume');
  };

  /**
   * 第二航班起飞时间
   */
  flight2StartTime = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(2) .trip-box > div:nth-child(1) .time');
  };
  /**
   * 第二航班起飞机场
   */
  flight2StartAddress = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(2) .trip-box > div:nth-child(1) .airport');
  };

  /**
   * 第二航班到达时间
   */
  flight2ArriveTime = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(2) .trip-box > div:nth-child(2) .time');
  };
  /**
   * 第二航班到达机场
   */
  flight2ArriveAddress = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(2) .trip-box > div:nth-child(2) .airport');
  };
  /**
   * 第二航班准点率
   */
  flight2OnTime = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(2) .extra .extra-text');
  };
  /**
   * 第二航班飞行时间
   */
  flight2Duration = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(2) .extra .consume');
  };
  /**
   * 经停
   */
  stoppedCity2 = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, ['.each-box:nth-child(2) .transfer-info .prompt', '.each-box:nth-child(2) .transfer-info .city']);
  };

  /**
   * 中转停留时间
   */
  stopTime2 = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(2) .transfer-info .hint');
  };

  /**
   * 第三航班起飞时间
   */
  flight3StartTime = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(3) .trip-box > div:nth-child(1) .time');
  };
  /**
   * 第三航班起飞机场
   */
  flight3StartAddress = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(3) .trip-box > div:nth-child(1) .airport');
  };

  /**
   * 第三航班到达时间
   */
  flight3ArriveTime = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(3) .trip-box > div:nth-child(2) .time');
  };
  /**
   * 第三航班到达机场
   */
  flight3ArriveAddress = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(3) .trip-box > div:nth-child(2) .airport');
  };
  /**
   * 第三航班准点率
   */
  flight3OnTime = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(3) .extra .extra-text');
  };
  /**
   * 第三航班飞行时间
   */
  flight3Duration = async (node: ElementHandle, pop: ElementHandle) => {
    return await queryInnerText(pop, '.each-box:nth-child(3) .extra .consume');
  };

  constructor(root: ElementHandle, page: Page) {
    if (root == undefined) {
      return;
    }
    this.rootElement = root;
    this.page = page;
  }

  async createFlightInfo() {
    this.flightInfo = new FlightInfo();
    // 鼠标放在中转上
    let popHandler = await this.rootElement.$('.arrow-transfer');
    if (popHandler == undefined) {
      // 直飞
      this.flight1ArriveAddress = '' as any;
      this.flight1ArriveTime = '' as any;
      this.flight1Duration = '' as any;
      this.flight1OnTime = '' as any;
      this.flight2StartAddress = '' as any;
      this.flight2StartTime = '' as any;
      this.flight2ArriveAddress = '' as any;
      this.flight2ArriveTime = '' as any;
      this.flight2Duration = '' as any;
      this.flight2OnTime = '' as any;
      this.flight3StartAddress = '' as any;
      this.flight3StartTime = '' as any;
      this.flight3ArriveAddress = '' as any;
      this.flight3ArriveTime = '' as any;
      this.flight3Duration = '' as any;
      this.flight3OnTime = '' as any;
      this.stopTime = '' as any;
      this.stoppedCity = '' as any;
    } else {
      await popHandler.hover();
      await this.page.waitFor(300);
      await popHandler.hover();
      await this.page.waitFor(300);
      await this.page.mouse.move(0, 0);
      await this.page.waitFor(300);
      this.popElement = await this.page.$('.popups.popup-flightinfo');
      if (this.popElement != undefined) {
        let boxList = await this.popElement.$$('.each-box');
        if (boxList != undefined && boxList.length == 2) {
          this.flight3StartAddress = '' as any;
          this.flight3StartTime = '' as any;
          this.flight3ArriveAddress = '' as any;
          this.flight3ArriveTime = '' as any;
          this.flight3Duration = '' as any;
          this.flight3OnTime = '' as any;
        }
      }
    }
    for (let propName in this.flightInfo) {
      // this.propName 存的值是选择器
      let selector = this[propName];
      // 用selector到this.root中去找，返回的就是航班的信息
      if (typeof selector === 'string' || Array.isArray(selector)) {
        this.flightInfo[propName] = await queryInnerText(this.rootElement, selector);
      } else if (typeof selector === 'function') {
        this.flightInfo[propName] = await selector(this.rootElement, this.popElement);
      }
    }
    return this.flightInfo;
  }
}
