const puppeteer = require('puppeteer');

/**
 * 判断是否是国际航班页面
 */
function isBookPage(page) {
    return page.url().indexOf('flights.ctrip.com/international/') != -1;
}

async function getTickerType(page) {
   let value = await  page.$evaluate(() => document.querySelector('#drpSubClass').value);
   let seat = '';
   if (value == 'Y_S') {
      seat = '经济票';
    } else if (value == 'C_F' || value == 'C' || value == 'F') {
      seat = '商务票';
    }
    return seat;
}