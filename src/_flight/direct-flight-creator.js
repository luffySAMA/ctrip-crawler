/**
 * 直飞航班
 */
class DirectFlightCreator {
  constructor(root) {
    this.init();
    if (root == undefined) {
      return;
    }
    this.root = root;
    this.createFlightInfo();
  }

  createFlightInfo() {
    this.flightInfo = new FlightInfo();
    for (let propName in this.flightInfo) {
      // this.propName 存的值是选择器
      let selector = this[propName];
      // 用selector到this.root中去找，返回的就是航班的信息
      this.flightInfo[propName] = querySelector(this.root, selector);
    }
  }

  init() {
    /**
     * 起飞机场
     */
    this.fromAirport = '.right div+div';
    /**
     * 到达机场
     */
    this.toAirport = '.left div+div';
    /**
     * 航空公司
     */
    this.airline = '.logo .flight_logo';
    /**
     * 航班编号
     */
    this.flightNum = '.logo .flight_logo+span';
    /**
     * 机型
     */
    this.airplane = '.logo .craft';
    /**
     * 计划起飞时间
     */
    this.startTime = '.right .time';
    /**
     * 计划到达时间
     */
    this.endTime = '.left .time';
    /**
     * 总飞行时长
     */
    this.duration = function(node) {
      let start = querySelector(node, '.right .time');
      let startHour = parseInt(start.split(':')[0]);
      let startMinute = parseInt(start.split(':')[1]);
      let end = querySelector(node, '.left .time');
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
    this.priceEconomy = function(node) {
      let temp = '<dfn>¥</dfn>';
      return '¥' + querySelector(node, '.price .base_price02').substr(temp.length);
    };
    /**
     * 商务舱价格
     */
    this.priceBusiness = '';
    /**
     * 头等舱价格
     */
    this.priceFirst = '';
    /**
     * 准点率
     */
    this.onTime = '.service span[data-bit="OnTimeRate"]';
    /**
     * 经停
     */
    this.stoppedCity = function(node) {
      let temp = querySelector(node, '.stopover .low_text');
      // 去掉<br>
      temp = temp.substring(0, temp.length - 4);
      return temp.length > 0 ? '经停' + temp : '';
    };
  }
}
