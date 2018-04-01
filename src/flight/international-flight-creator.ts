import { ElementHandle } from 'puppeteer';
import { FlightInfo } from './flight-info';
import { queryInnerHTML, queryInnerText } from '../util/util';
/**
 * 国际航班
 */
export class InternationalFlightCreator {
  flightInfo: FlightInfo;
  rootElement: ElementHandle;

  /**
   * 起飞机场
   */
  fromAirport = async (node: ElementHandle) => {
    let selector = '.flight-detail-expend .flight-detail-section:nth-child(1) .section-airport';
    return await queryInnerText(node, selector);
  };
  /**
   * 到达机场
   */
  toAirport = async (node: ElementHandle) => {
    let selector = [
      '.flight-detail-expend .flight-detail-section:nth-child(3) .section-airport',
      '.flight-detail-expend .flight-detail-section:nth-child(3) .section-terminal'
    ];
    let airport = await queryInnerHTML(node, selector);
    if (airport.indexOf('<') > 0) {
      return airport.substring(0, airport.indexOf('<'));
    } else {
      return airport;
    }
  };
  /**
   * 航空公司
   */
  airline = async (node: ElementHandle) => {
    // 多个航空公司的时候，选主要航空公司
    let airline = await queryInnerHTML(node, '.flight-row .airline-name .base-airline');
    if (airline != '') {
      return airline;
    } else {
      return await queryInnerHTML(node, '.flight-row .airline-name');
    }
  };
  /**
   * 航班编号
   */
  flightNum = '.flight-detail-expend .flight-detail-section:nth-child(1) .flight-No';
  /**
   * 机型
   */
  airplane = '.flight-detail-expend .flight-detail-section:nth-child(1) .abbr';
  /**
   * 计划起飞时间
   */
  startTime = [
    '.flight-detail-expend .flight-detail-section:nth-child(1) .section-date',
    '.flight-detail-expend .flight-detail-section:nth-child(1) .section-time'
  ];
  /**
   * 计划到达时间
   */
  endTime = [
    '.flight-detail-expend .flight-detail-section:nth-child(3) .section-date',
    '.flight-detail-expend .flight-detail-section:nth-child(3) .section-time'
  ];
  /**
   * 总飞行时长
   */
  duration = async (node: ElementHandle) => {
    return await queryInnerText(node, '.flight-total-time');
  };
  /**
   * 经济舱价格
   */
  priceEconomy = async (node: ElementHandle) => {
    return await queryInnerText(node, '.price');
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
  onTime = '';
  /**
   * 第二班准点率
   */
  // this.onTime = '.service span[data-bit="OnTimeRate"]';
  /**
   * 经停
   */
  stoppedCity = async (node: ElementHandle) => {
    return '中转' + (await queryInnerHTML(node, '.section-stop .in strong'));
  };

  /**
   * 中转停留时间
   */
  stopTime = async (node: ElementHandle) => {
    let temp = await queryInnerHTML(node, '.section-stop .in');
    return temp.substring(temp.lastIndexOf('：') + 1);
  };

  /**
   * 第一航班到达时间
   */
  flight1ArriveTime = [
    '.flight-detail-expend .flight-detail-section:nth-child(1) p:last-child .section-date',
    '.flight-detail-expend .flight-detail-section:nth-child(1) p:last-child .section-time'
  ];
  /**
   * 第一航班到达机场
   */
  flight1ArriveAddress = async (node: ElementHandle) => {
    let selector = '.flight-detail-expend .flight-detail-section:nth-child(1) p:last-child .section-airport';
    let airport = await queryInnerHTML(node, selector);
    if (airport.indexOf('<') > 0) {
      return airport.substring(0, airport.indexOf('<'));
    } else {
      return airport;
    }
  };
  /**
   * 第一航班准点率
   */
  flight1OnTime = '.flight-detail-expend .flight-detail-section:nth-child(1) .section-terminal .section-duration';
  /**
   * 第一航班飞行时间
   */
  flight1Duration = '.flight-detail-expend .flight-detail-section:nth-child(1) p.section-flight-base+p .section-duration';

  /**
   * 第二航班到达时间
   */
  flight2ArriveTime = [
    '.flight-detail-expend .flight-detail-section:nth-child(3) p:last-child .section-date',
    '.flight-detail-expend .flight-detail-section:nth-child(3) p:last-child .section-time'
  ];
  /**
   * 第二航班到达机场
   */
  flight2ArriveAddress = async (node: ElementHandle) => {
    let selector = '.flight-detail-expend .flight-detail-section:nth-child(3) p:last-child .section-airport';
    let airport = await queryInnerHTML(node, selector);
    if (airport.indexOf('<') > 0) {
      return airport.substring(0, airport.indexOf('<'));
    } else {
      return airport;
    }
  };
  /**
   * 第二航班准点率
   */
  flight2OnTime = '.flight-detail-expend .flight-detail-section:nth-child(3) .section-terminal .section-duration';
  /**
   * 第二航班飞行时间
   */
  flight2Duration = '.flight-detail-expend .flight-detail-section:nth-child(3) p.section-flight-base+p .section-duration';

  /**
   * 经停
   */
  stoppedCity2 = async (node: ElementHandle) => {
    let nodeList = await node.$$('.section-stop');
    if (nodeList.length > 1) {
      return '中转' + (await queryInnerHTML(nodeList[1], '.in strong'));
    } else {
      return '';
    }
  };

  /**
   * 中转停留时间
   */
  stopTime2 = async (node: ElementHandle) => {
    let nodeList = await node.$$('.section-stop');
    if (nodeList.length > 1) {
      let temp = await queryInnerHTML(nodeList[1], '.in');
      return temp.substring(temp.lastIndexOf('：') + 1);
    } else {
      return '';
    }
  };
  /**
   * 第三航班到达时间
   */
  flight3ArriveTime = [
    '.flight-detail-expend .flight-detail-section:nth-child(5) p:last-child .section-date',
    '.flight-detail-expend .flight-detail-section:nth-child(5) p:last-child .section-time'
  ];
  /**
   * 第三航班到达机场
   */
  flight3ArriveAddress = async (node: ElementHandle) => {
    let selector = '.flight-detail-expend .flight-detail-section:nth-child(5) p:last-child .section-airport';
    let airport = await queryInnerHTML(node, selector);
    if (airport.indexOf('<') > 0) {
      return airport.substring(0, airport.indexOf('<'));
    } else {
      return airport;
    }
  };
  /**
   * 第三航班准点率
   */
  flight3OnTime = '.flight-detail-expend .flight-detail-section:nth-child(5) .section-terminal .section-duration';
  /**
   * 第三航班飞行时间
   */
  flight3Duration = '.flight-detail-expend .flight-detail-section:nth-child(5) p.section-flight-base+p .section-duration';

  constructor(root: ElementHandle) {
    if (root == undefined) {
      return;
    }
    this.rootElement = root;
  }

  async createFlightInfo() {
    this.flightInfo = new FlightInfo();
    let nodeList = await this.rootElement.$$('.flight-detail-expend .flight-detail-section');
    if (nodeList.length === 1) {
      // 直飞
      this.flight1ArriveAddress = '' as any;
      this.flight1ArriveTime = '' as any;
      this.flight1Duration = '' as any;
      this.flight1OnTime = '' as any;
      this.flight2ArriveAddress = '' as any;
      this.flight2ArriveTime = '' as any;
      this.flight2Duration = '' as any;
      this.flight2OnTime = '' as any;
      this.flight3ArriveAddress = '' as any;
      this.flight3ArriveTime = '' as any;
      this.flight3Duration = '' as any;
      this.flight3OnTime = '' as any;
      this.stopTime = '' as any;
      this.stoppedCity = '' as any;
    }
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
