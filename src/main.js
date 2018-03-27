// 接收来自后台的消息
function startDownload() {
  if (window.location.href.indexOf('flights.ctrip.com/international/') != -1) {
    // 国际航班
    let value = document.querySelector('#drpSubClass').value;
    let seat = '';
    if (value == 'Y_S') {
      seat = '经济票';
    } else if (value == 'C_F' || value == 'C' || value == 'F') {
      seat = '商务票';
    }
    toastr.info(`开始下载国际航班${seat}...`);
    window.scrollTo(0, 9999);
    document.querySelectorAll('.flight-action-more a').forEach(linkMore => {
      linkMore.click();
    });
    toastr.info(`请等待${seat}数据加载完后重新点击下载按钮...`);
    setTimeout(() => {
      let fileName = getFileName(seat);
      let csv = getCsv(seat);
      download(fileName, csv);
      if (seat == '经济票') {
        document.querySelector('#drpSubClass').value = 'C_F';
      } else if (seat == '商务票') {
        document.querySelector('#drpSubClass').value = 'Y_S';
      }
      setTimeout(() => {
        document.querySelector('#btnSearch').click();
      }, 2000);
    }, 1000);
  }
  if (window.location.href.indexOf('flights.ctrip.com/booking/') != -1) {
    // 国内航班
    document.querySelectorAll("#J_flightFilter input[name='filter_Classes']")[0].click();
    // document.querySelector('.btn_book.J_expandBtn').click();
    window.scrollTo(0, 9999);
    setTimeout(() => {
      let fileName = getFileName('经济票');
      let csv = getCsv('经济票');
      download(fileName, csv);
      toastr.info(`开始下载国内航班经济票...`);
      document.querySelectorAll("#J_flightFilter input[name='filter_Classes']")[1].click();
      // document.querySelector('.btn_book.J_expandBtn').click();
      window.scrollTo(0, 9999);
      setTimeout(() => {
        let fileName = getFileName('商务票');
        let csv = getCsv('商务票');
        toastr.info(`开始下载国内航班商务票...`);
        download(fileName, csv);
      }, 1000);
    }, 1000);
  }
}
function getFileName(seat) {
  // 起飞机场
  let fromAirport = getFromAirport();
  // 目的机场
  let toAirport = getToAirport();
  // 日期
  let flightDate = getFlightDate();

  // 文件名
  let fileName = `${fromAirport}-${toAirport}-${flightDate}-${seat}.csv`;
  return fileName;
}

function getCsv(seat) {
  // 文件内容
  let csv = `航空公司,航班编号,机型,起飞机场,计划起飞时间,是否中转/经停,,,,,,,,,,,,,,,,到达机场,计划到达时间,总飞行时长,${seat}价（元）,总到达准点率
,,,,,第一航段到达机场,第一航段到达时间,第一航段飞行时间,第一航段准点率,中转停留时间,经停机场,第二航段起飞机场,第二航段起飞时间,第二航段飞行时间,第二航段准点率,第二航段中转停留时间,第二航段经停机场,第三航段起飞机场,第三航段起飞时间,第三航段飞行时间,第三航段准点率`;
  getFlightInfo().forEach(flight => {
    if (flight) {
      // 中转航班如果没有把鼠标放上去，就不导出
      csv += FlightInfo.prototype.toCsv.apply(flight);
    }
  });
  return csv;
}
/**
 * 从输入框中查询起飞机场
 */
function getFromAirport() {
  if (window.location.href.indexOf('flights.ctrip.com/international/') != -1) {
    // 国际航班
    return document.querySelectorAll('#homeCity')[0].value;
  } else if (window.location.href.indexOf('flights.ctrip.com/booking/') != -1) {
    // 国内航班
    return document.querySelectorAll('#DCityName1')[0].value;
  }
}
/**
 * 从输入框中查询目的机场
 */
function getToAirport() {
  if (window.location.href.indexOf('flights.ctrip.com/international/') != -1) {
    // 国际航班
    return document.querySelectorAll('#destCity')[0].value;
  } else if (window.location.href.indexOf('flights.ctrip.com/booking/') != -1) {
    // 国内航班
    return document.querySelectorAll('#ACityName1')[0].value;
  }
}
/**
 * 从输入框中查询起飞日期
 */
function getFlightDate() {
  if (window.location.href.indexOf('flights.ctrip.com/international/') != -1) {
    // 国际航班
    return document.querySelectorAll('#DDate')[0].value;
  } else if (window.location.href.indexOf('flights.ctrip.com/booking/') != -1) {
    // 国内航班
    return document.querySelectorAll('#DDate1')[0].value;
  }
}
/**
 * 从页面获取所有的航班信息
 *
 * 返回FlightInfo的数组
 */
function getFlightInfo() {
  let resultFlights = [];
  // 查找国内直飞
  document.querySelectorAll('.search_table_header .J_header_row').forEach(flightDiv => {
    let flight = new DirectFlightCreator(flightDiv).flightInfo;
    resultFlights.push(flight);
  });
  // 查找国内中转
  let stopDivList = document.querySelectorAll('.popup_transfer_detail');
  document.querySelectorAll('.search_transfer_header.J_header_row.J_header_wrap').forEach((flightDiv, i) => {
    let stopDiv = stopDivList[i];
    let flight = new StopFlightCreator(flightDiv, stopDiv).flightInfo;
    resultFlights.push(flight);
  });
  // 查找国际航班
  document.querySelectorAll('.flight-item').forEach(flightDiv => {
    let flight = new InternationalFlightCreator(flightDiv).flightInfo;
    resultFlights.push(flight);
  });
  return resultFlights;
}

/**
 * 下载文件
 * @param {*} fileName 文件名
 * @param {*} content 文件内容
 */
function download(fileName, content) {
  let blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, fileName);
}
