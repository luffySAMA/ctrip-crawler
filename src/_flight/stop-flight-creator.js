/**
 * 中转航班
 */
class StopFlightCreator {
  constructor(root, stopDiv) {
    this.init();
    if (root == undefined || stopDiv == undefined) {
      toastr.warning('请先把鼠标放在中转航班上，然后再下载');
      return;
    }
    this.root = root;
    this.stopDiv = stopDiv;
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
    this.duration = node => {
      let start = querySelector(node, '.right .time');
      let end = querySelector(node, '.left .time');
      return this.durationTime(start, end);
    };

    /**
     * 经济舱价格
     */
    this.priceEconomy = node => {
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
    // this.onTime = '.service span[data-bit="OnTimeRate"]';

    /**
     * 经停
     */
    this.stoppedCity = node => {
      return '中转' + querySelector(node, '.J_trans_pop .stay-city .city-name');
    };

    /**
     * 中转停留时间
     */
    this.stopTime = '.J_trans_pop .stay-time';

    /**
     * 第一航班到达时间
     */
    this.flight1ArriveTime = () => {
      let end = this.stopDiv.querySelector('.first_half .arrive-time').innerHTML;
      let endSpan = this.stopDiv.querySelector('.first_half .arrive-time span');
      if (endSpan) {
        end = end.replace(endSpan.outerHTML, '');
      }
      return end;
    };
    /**
     * 第一航班到达机场
     */
    this.flight1ArriveAddress = () => {
      let selector = '.first_half .arrive-airport';
      return this.stopDiv.querySelector(selector).innerHTML;
    };
    /**
     * 第一航班准点率
     */
    this.flight1OnTime = '.service span[data-bit="OnTimeRate"]';
    /**
     * 第一航班飞行时间
     */
    this.flight1Duration = () => {
      let start = this.stopDiv.querySelector('.first_half .depart-time').innerHTML;
      let startSpan = this.stopDiv.querySelector('.first_half .depart-time span');
      if (startSpan) {
        start = start.replace(startSpan.outerHTML, '');
      }
      let end = this.stopDiv.querySelector('.first_half .arrive-time').innerHTML;
      let endSpan = this.stopDiv.querySelector('.first_half .arrive-time span');
      if (endSpan) {
        end = end.replace(endSpan.outerHTML, '');
      }
      return this.durationTime(start, end);
    };

    /**
     * 第二航班起飞时间
     */
    this.flight2ArriveTime = () => {
      let start = this.stopDiv.querySelector('.second_half .depart-time').innerHTML;
      let startSpan = this.stopDiv.querySelector('.second_half .depart-time span');
      if (startSpan) {
        start = start.replace(startSpan.outerHTML, '');
      }
      return start;
    };
    /**
     * 第二航班起飞机场
     */
    this.flight2ArriveAddress = () => {
      let selector = '.second_half .depart-airport';
      return querySelector(this.stopDiv, selector);
    };
    /**
     * 第二航班准点率
     */
    this.flight2OnTime = '.service span[data-bit="OnTimeRate"]:last-child';
    /**
     * 第二航班飞行时间
     */
    this.flight2Duration = () => {
      let start = this.stopDiv.querySelector('.second_half .depart-time').innerHTML;
      let startSpan = this.stopDiv.querySelector('.second_half .depart-time span');
      if (startSpan) {
        start = start.replace(startSpan.outerHTML, '');
      }
      let end = this.stopDiv.querySelector('.second_half .arrive-time').innerHTML;
      let endSpan = this.stopDiv.querySelector('.second_half .arrive-time span');
      if (endSpan) {
        end = end.replace(endSpan.outerHTML, '');
      }
      return this.durationTime(start, end);
    };
  }

  durationTime(start, end) {
    let startHour = parseInt(start.split(':')[0]);
    let startMinute = parseInt(start.split(':')[1]);
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
  }
}
