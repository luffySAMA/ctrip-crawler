import { DomesticFlightPage } from '../page/domestic-flight-page';
import * as fs from 'fs';
import { Browser } from 'puppeteer';
import { formatDate } from '../util/util';
export class Task {
  browser: Browser;
  constructor(browser: Browser) {
    this.browser = browser;
  }
  async run(fromAirport: string, toAirport: string, date?: string) {
    if (date == undefined) {
      date = formatDate(new Date());
    }
    const page = await this.browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    try {
      // 进入页面
      await page.goto(`http://flights.ctrip.com/booking/${fromAirport}-${toAirport}-day-1.html?ddate1=${date}`);

      // 国内航班
      if (page.url().indexOf('flights.ctrip.com/booking/') != -1) {
        let p = new DomesticFlightPage(page);
        await p.wait();
        await p.beforeDownload();
        let flightList = await p.getFlightList();

        let csv = `航空公司,航班编号,机型,起飞机场,计划起飞时间,是否中转/经停,,,,,,,,,,,,,,,,到达机场,计划到达时间,总飞行时长,经济票价（元）,总到达准点率
,,,,,第一航段到达机场,第一航段到达时间,第一航段飞行时间,第一航段准点率,中转停留时间,经停机场,第二航段起飞机场,第二航段起飞时间,第二航段飞行时间,第二航段准点率,第二航段中转停留时间,第二航段经停机场,第三航段起飞机场,第三航段起飞时间,第三航段飞行时间,第三航段准点率`;
        flightList.forEach(flight => {
          csv += flight.toCsv();
        });
        let writerStream = fs.createWriteStream(`result/${fromAirport}-${toAirport}-${date}.csv`);
        writerStream.write(csv, 'UTF8');
        writerStream.end();
        await page.screenshot({ path: `result/${fromAirport}-${toAirport}-${date}.png`, fullPage: true });
      }
    } catch (error) {
      await page.screenshot({ path: `result/errors/error-${fromAirport}-${toAirport}-${date}.png`, fullPage: true });
    }
  }
}
