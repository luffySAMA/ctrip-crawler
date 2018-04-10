import { FlightInfo } from './../flight/flight-info';
/**
 *
 */
export interface FlightPage {
  /**
   * 航班数据
   */
  flightList: Array<FlightInfo>;

  /**
   * 检验url是否是该类型的网页
   */
  verifyURL(): Promise<boolean>;
  /**
   * 等待页面加载完毕
   *
   * 比如等待loading元素消失
   */
  wait(): Promise<void>;

  /**
   * 在页面加载完毕之后，为了让需要的数据完成展示出来，需要做哪些操作
   *
   * 比如将滚动条滚动到底，或者点击某个按钮
   */
  beforeDownload(): Promise<void>;

  /**
   * 抓取页面的航班信息
   */
  getFlightList(): Promise<Array<FlightInfo>>;

  fromAirportName(): Promise<string>;

  toAirportName(): Promise<string>;
}
