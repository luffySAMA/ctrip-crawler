/**
 * 航班信息
 */
export class FlightInfo {
  /**
   * 起飞机场
   */
  fromAirport = '';
  /**
   * 到达机场
   */
  toAirport = '';
  /**
   * 航空公司
   */
  airline = '';
  /**
   * 航班编号
   */
  flightNum = '';
  /**
   * 机型
   */
  airplane = '';
  /**
   * 计划起飞时间
   */
  startTime = '';
  /**
   * 计划到达时间
   */
  endTime = '';
  /**
   * 总飞行时长
   */
  duration = '';
  /**
   * 经济舱价格
   */
  priceEconomy = '';
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
   * 中转停留时间
   */
  stopTime = '';

  /**
   * 经停
   */
  stoppedCity = '';

  /**
   * 第一航班到达时间
   */
  flight1ArriveTime = '';
  /**
   * 第一航班到达机场
   */
  flight1ArriveAddress = '';
  /**
   * 第一航班准点率
   */
  flight1OnTime = '';
  /**
   * 第一航班飞行时间
   */
  flight1Duration = '';

  /**
   * 第二航班到达时间
   */
  flight2StartTime = '';
  /**
   * 第二航班到达机场
   */
  flight2StartAddress = '';
  /**
   * 第二航班到达时间
   */
  flight2ArriveTime = '';
  /**
   * 第二航班到达机场
   */
  flight2ArriveAddress = '';
  /**
   * 第二航班准点率
   */
  flight2OnTime = '';
  /**
   * 第二航班飞行时间
   */
  flight2Duration = '';
  /**
   * 第二航班中转停留时间
   */
  stopTime2 = '';

  /**
   * 第二航班经停
   */
  stoppedCity2 = '';
  /**
   * 第三航班到达时间
   */
  flight3StartTime = '';
  /**
   * 第三航班到达机场
   */
  flight3StartAddress = '';
  /**
   * 第三航班到达时间
   */
  flight3ArriveTime = '';
  /**
   * 第三航班到达机场
   */
  flight3ArriveAddress = '';
  /**
   * 第三航班准点率
   */
  flight3OnTime = '';
  /**
   * 第三航班飞行时间
   */
  flight3Duration = '';
  constructor() {}
  toCsv() {
    let csv = `
    ${this.airline},${this.flightNum},${this.airplane},${this.fromAirport},${this.startTime},${this.flight1ArriveAddress},${this.flight1ArriveTime},${this.flight1Duration},${this.flight1OnTime},${this.stopTime},${this.stoppedCity},${this.flight2StartAddress},${this.flight2StartTime},${this.flight2Duration},${this.flight2OnTime},${this.stopTime2},${this.stoppedCity2},${this.flight2ArriveAddress},${this.flight2ArriveTime},${this.flight3StartAddress},${this.flight3StartTime},${this.flight3Duration},${this.flight3OnTime},${this.flight3ArriveAddress},${this.flight3ArriveTime},${this.toAirport},${this.endTime},${this.duration},${this.priceEconomy},${this.onTime}`;
    return csv;
  }
}
