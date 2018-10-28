import { InternationalFlightPage1 } from './../page/international-page1';
import { InternationalFlightPage2 } from './../page/international-page2';
import { DomesticFlightPage } from '../page/domestic-flight-page';
import { Browser, Page } from 'puppeteer';
import { formatDate } from '../util/util';
import { FlightPage } from '../page/page';

import * as fs from 'fs';
import * as path from 'path';
import { isFileExist } from '../util/file-util';
import { loginPage } from '../..';
// import { promisify } from 'util';

// let mkdir = promisify(fs.mkdir);
// let stat = promisify(fs.stat);

export class Task {
  browser: Browser;
  page: Page;
  from: string;
  to: string;
  date: string;
  finished = false;
  constructor(browser: Browser, fromAirport: string, toAirport: string, date?: string) {
    this.browser = browser;
    this.from = fromAirport;
    this.to = toAirport;
    this.date = date || formatDate(new Date());
  }
  async run() {
    let resultFolder = path.join(__dirname, '../../../result');
    let saveFile = path.join(__dirname, '../../../config/save.txt');
    let failFile = path.join(__dirname, '../../../config/fail.txt');
    let errorFile = path.join(__dirname, '../../../error.log');
    let airline = `${this.from}-${this.to}`;
    let subFolder = path.join(resultFolder, this.date);
    // let csvPath = path.join(subFolder, `${this.from}.csv`);
    // let screenPath = path.join(subFolder, `${airline}-${this.date}.png`);
    // let errScreenPath = path.join(subFolder, `${airline}-${date}.png`);
    const page = await this.browser.newPage();
    this.page = page;
    await page.setViewport({ width: 1440, height: 800 });
    try {
      // 进入页面
      await page.goto(`http://flights.ctrip.com/international/search/oneway-${airline}?depdate=${this.date}`);
      let loginBtn = await page.$('#c_ph_login');
      if (loginBtn != undefined) {
        await loginBtn.click();
        await page.waitFor(1000);
        await loginPage(page);
        await page.goto(`http://flights.ctrip.com/international/search/oneway-${airline}?depdate=${this.date}`);
      }
      let p: FlightPage;
      if (page.url().indexOf('flights.ctrip.com/itinerary/') != -1) {
        // 国内航班
        p = new DomesticFlightPage(page);
      } else if (page.url().indexOf('flights.ctrip.com/international/') != -1) {
        // 国际航班
        let v2 = await page.$('.modify-search-v2');
        if (v2 == undefined) {
          p = new InternationalFlightPage1(page);
        } else {
          p = new InternationalFlightPage2(page);
        }
      }
      await p.wait();
      await p.beforeDownload();
      let fromAirportName = await p.fromAirportName();
      let toAirportName = await p.toAirportName();
      fromAirportName = fromAirportName || this.from;
      toAirportName = toAirportName || this.to;
      let csvPath = path.join(subFolder, `${fromAirportName}.csv`);
      let csv = '';
      let exist = await isFileExist(csvPath);
      if (!exist) {
        csv += `\uFEFF
      航空公司,航班编号,机型,起飞机场,计划起飞时间,是否中转/经停,,,,,,,,,,,,,,,,,,,,到达机场,计划到达时间,总飞行时长,经济票价（元）,总到达准点率
,,,,,第一航段到达机场,第一航段到达时间,第一航段飞行时间,第一航段准点率,中转停留时间,经停机场,第二航段起飞机场,第二航段起飞时间,第二航段飞行时间,第二航段准点率,第二航段中转停留时间,第二航段经停机场,第二航段到达机场,第二航段到达时间,第三航段起飞机场,第三航段起飞时间,第三航段飞行时间,第三航段准点率,第三航段到达机场,第三航段到达时间`;
      }
      let flightList = await p.getFlightList();
      csv += `

      ${fromAirportName} -> ${toAirportName}, (${flightList.length})`;

      flightList.forEach(flight => {
        csv += flight.toCsv();
      });

      fs.appendFile(csvPath, csv, () => {});
      fs.writeFile(saveFile, `${this.from}\n${this.to}`, () => {});
      console.log(`${fromAirportName} -> ${toAirportName}\t${flightList.length}条航班`);
      // await page.screenshot({ path: screenPath, fullPage: true });
    } catch (error) {
      console.log(error);
      fs.appendFile(failFile, `${this.from},${this.to}\n`, () => {});
      fs.appendFile(errorFile, `${new Date().toString()}\t${this.from} -> ${this.to}\t${error}\n`, () => {});
      // return;
    } finally {
      await page.close();
      this.finished = true;
    }
  }

  cancel() {
    if (!this.finished) {
      this.page.close();
    }
  }
}
