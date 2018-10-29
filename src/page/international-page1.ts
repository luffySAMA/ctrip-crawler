import { FlightPage } from './page';
import { FlightInfo } from '../flight/flight-info';
import { Page } from 'puppeteer';
import { InternationalFlightCreator1 } from '../flight/international-flight-creator1';

export class InternationalFlightPage1 implements FlightPage {
  flightList: FlightInfo[];
  page: Page;

  constructor(page: Page) {
    this.page = page;
    this.flightList = [];
  }

  async verifyURL(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.page.once('load', () => {
        let url = this.page.url();
        resolve(url.indexOf('flights.ctrip.com/international/') != -1);
      });
    });
  }

  async wait(): Promise<void> {
    await this.page.waitFor('.loading_animate', { hidden: true });
    await this.page.waitFor(20);
    await this.page.waitFor('.search_loading', { hidden: true });
    await this.page.waitFor(20);
  }

  async beforeDownload(): Promise<void> {
    // 滚动到底部
    await this.page.evaluate(() => {
      return new Promise(resolve => {
        let scroll_times = 0; // 滚动次数,滚动10次还没到底，就不再滚动
        let interval = setInterval(() => {
          if (scroll_times < 10 && window.scrollY + window.innerHeight < document.body.scrollHeight) {
            window.scroll(0, document.body.scrollHeight);
            scroll_times++;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              resolve();
            }, 200);
          }
        }, 200);
      });
    });

    // 展开详情，获取准点率

    await this.page.evaluate(() => {
      document.querySelectorAll('.flight-action-more a').forEach((linkMore: HTMLAnchorElement) => {
        linkMore.click();
      });
    });
  }
  async getFlightList(): Promise<FlightInfo[]> {
    // 国际
    let flightList = await this.page.$$('.flight-item');

    await Promise.all(
      flightList.map(async flight => {
        let creator = new InternationalFlightCreator1(flight);
        let flightInfo = await creator.createFlightInfo();
        this.flightList.push(flightInfo);
      })
    );

    return this.flightList;
  }

  async fromAirportName(): Promise<string> {
    return this.page.evaluate(() => {
      let input = <HTMLInputElement>document.querySelector('#homeCity');
      return input && input.value;
    });
  }

  async toAirportName(): Promise<string> {
    return this.page.evaluate(() => {
      let input = <HTMLInputElement>document.querySelector('#destCity');
      return input && input.value;
    });
  }
}
