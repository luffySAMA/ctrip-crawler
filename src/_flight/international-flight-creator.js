/**
 * 国际航班
 */
class InternationalFlightCreator {
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
    if (this.root.querySelectorAll('.flight-detail-expend .flight-detail-section').length === 1) {
      // 直飞
      this.flight1ArriveAddress = '';
      this.flight1ArriveTime = '';
      this.flight1Duration = '';
      this.flight1OnTime = '';
      this.flight2ArriveAddress = '';
      this.flight2ArriveTime = '';
      this.flight2Duration = '';
      this.flight2OnTime = '';
      this.flight3ArriveAddress = '';
      this.flight3ArriveTime = '';
      this.flight3Duration = '';
      this.flight3OnTime = '';
      this.stopTime = '';
      this.stoppedCity = '';
    }
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
    this.fromAirport = function(node) {
      let selector = [
        '.flight-detail-expend .flight-detail-section:nth-child(1) .section-airport',
        '.flight-detail-expend .flight-detail-section:nth-child(1) .section-terminal'
      ];
      let airport = querySelector(node, selector);
      if (airport.indexOf('<') > 0) {
        return airport.substring(0, airport.indexOf('<'));
      } else {
        return airport;
      }
    };
    /**
     * 到达机场
     */
    this.toAirport = function(node) {
      let selector = [
        '.flight-detail-expend .flight-detail-section:nth-child(3) .section-airport',
        '.flight-detail-expend .flight-detail-section:nth-child(3) .section-terminal'
      ];
      let airport = querySelector(node, selector);
      if (airport.indexOf('<') > 0) {
        return airport.substring(0, airport.indexOf('<'));
      } else {
        return airport;
      }
    };
    /**
     * 航空公司
     */
    this.airline = function(node) {
      // 多个航空公司的时候，选主要航空公司
      if (querySelector(node, '.flight-row .airline-name .base-airline').length > 0) {
        return querySelector(node, '.flight-row .airline-name .base-airline');
      } else {
        return querySelector(node, '.flight-row .airline-name');
      }
    };
    /**
     * 航班编号
     */
    this.flightNum = '.flight-detail-expend .flight-detail-section:nth-child(1) .flight-No';
    /**
     * 机型
     */
    this.airplane = '.flight-detail-expend .flight-detail-section:nth-child(1) .abbr';
    /**
     * 计划起飞时间
     */
    this.startTime = [
      '.flight-detail-expend .flight-detail-section:nth-child(1) .section-date',
      '.flight-detail-expend .flight-detail-section:nth-child(1) .section-time'
    ];
    /**
     * 计划到达时间
     */
    this.endTime = [
      '.flight-detail-expend .flight-detail-section:nth-child(3) .section-date',
      '.flight-detail-expend .flight-detail-section:nth-child(3) .section-time'
    ];
    /**
     * 总飞行时长
     */
    this.duration = function(node) {
      let totalTime = querySelector(node, '.flight-total-time');
      return totalTime.replace('\\&nbsp;', '');
    };
    /**
     * 经济舱价格
     */
    this.priceEconomy = function(node) {
      let temp = '<dfn>¥</dfn>';
      return '¥' + querySelector(node, '.price').substr(temp.length);
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
    this.onTime = '';
    /**
     * 第二班准点率
     */
    // this.onTime = '.service span[data-bit="OnTimeRate"]';
    /**
     * 经停
     */
    this.stoppedCity = function(node) {
      return '中转' + querySelector(node, '.section-stop .in strong');
    };

    /**
     * 中转停留时间
     */
    this.stopTime = function(node) {
      let temp = querySelector(node, '.section-stop .in');
      return temp.substring(temp.lastIndexOf('：') + 1);
    };

    /**
     * 第一航班到达时间
     */
    this.flight1ArriveTime = [
      '.flight-detail-expend .flight-detail-section:nth-child(1) p:last-child .section-date',
      '.flight-detail-expend .flight-detail-section:nth-child(1) p:last-child .section-time'
    ];
    /**
     * 第一航班到达机场
     */
    this.flight1ArriveAddress = function(node) {
      let selector = '.flight-detail-expend .flight-detail-section:nth-child(1) p:last-child .section-airport';
      let airport = querySelector(node, selector);
      if (airport.indexOf('<') > 0) {
        return airport.substring(0, airport.indexOf('<'));
      } else {
        return airport;
      }
    };
    /**
     * 第一航班准点率
     */
    this.flight1OnTime = '.flight-detail-expend .flight-detail-section:nth-child(1) .section-terminal .section-duration';
    /**
     * 第一航班飞行时间
     */
    this.flight1Duration = '.flight-detail-expend .flight-detail-section:nth-child(1) p.section-flight-base+p .section-duration';

    /**
     * 第二航班到达时间
     */
    this.flight2ArriveTime = [
      '.flight-detail-expend .flight-detail-section:nth-child(3) p:last-child .section-date',
      '.flight-detail-expend .flight-detail-section:nth-child(3) p:last-child .section-time'
    ];
    /**
     * 第二航班到达机场
     */
    this.flight2ArriveAddress = function(node) {
      let selector = '.flight-detail-expend .flight-detail-section:nth-child(3) p:last-child .section-airport';
      let airport = querySelector(node, selector);
      if (airport.indexOf('<') > 0) {
        return airport.substring(0, airport.indexOf('<'));
      } else {
        return airport;
      }
    };
    /**
     * 第二航班准点率
     */
    this.flight2OnTime = '.flight-detail-expend .flight-detail-section:nth-child(3) .section-terminal .section-duration';
    /**
     * 第二航班飞行时间
     */
    this.flight2Duration = '.flight-detail-expend .flight-detail-section:nth-child(3) p.section-flight-base+p .section-duration';

    /**
     * 经停
     */
    this.stoppedCity2 = function(node) {
      if (node.querySelectorAll('.section-stop').length > 1) {
        return '中转' + querySelector(node.querySelectorAll('.section-stop')[1], '.in strong');
      } else {
        return '';
      }
    };

    /**
     * 中转停留时间
     */
    this.stopTime2 = function(node) {
      if (node.querySelectorAll('.section-stop').length > 1) {
        let temp = querySelector(node.querySelectorAll('.section-stop')[1], '.in');
        return temp.substring(temp.lastIndexOf('：') + 1);
      } else {
        return '';
      }
    };
    /**
     * 第三航班到达时间
     */
    this.flight3ArriveTime = [
      '.flight-detail-expend .flight-detail-section:nth-child(5) p:last-child .section-date',
      '.flight-detail-expend .flight-detail-section:nth-child(5) p:last-child .section-time'
    ];
    /**
     * 第三航班到达机场
     */
    this.flight3ArriveAddress = function(node) {
      let selector = '.flight-detail-expend .flight-detail-section:nth-child(5) p:last-child .section-airport';
      let airport = querySelector(node, selector);
      if (airport.indexOf('<') > 0) {
        return airport.substring(0, airport.indexOf('<'));
      } else {
        return airport;
      }
    };
    /**
     * 第三航班准点率
     */
    this.flight3OnTime = '.flight-detail-expend .flight-detail-section:nth-child(5) .section-terminal .section-duration';
    /**
     * 第三航班飞行时间
     */
    this.flight3Duration = '.flight-detail-expend .flight-detail-section:nth-child(5) p.section-flight-base+p .section-duration';
  }
}
