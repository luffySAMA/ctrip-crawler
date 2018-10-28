import { StopFlightCreator } from './../flight/stop-flight-creator';
import { DirectFlightCreator } from './../flight/direct-flight-creator';
import { FlightPage } from './page';
import { FlightInfo } from '../flight/flight-info';
import { Page } from 'puppeteer';

export class DomesticFlightPage implements FlightPage {
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
        resolve(url.indexOf('flights.ctrip.com/booking/') != -1);
      });
    });
  }

  async wait(): Promise<void> {
    // let btnReSearch = await this.page.$('#btnReSearch');
    // if (btnReSearch) {
    //   await btnReSearch.click();
    await this.page.waitFor(20);
    await this.page.waitFor('#searchLoading', { hidden: true });
    await this.page.waitFor(20);
    await this.page.waitFor('#mask_loading', { hidden: true });
    await this.page.waitFor(20);
    // }
  }

  async beforeDownload(): Promise<void> {
    // 滚动到底部
    await this.page.evaluate(() => {
      return new Promise(resolve => {
        let interval = setInterval(() => {
          if (window.scrollY + window.innerHeight < document.body.scrollHeight) {
            window.scroll(0, document.body.scrollHeight);
          } else {
            clearInterval(interval);
            setTimeout(() => {
              resolve();
            }, 200);
          }
        }, 200);
      });
    });
  }
  async getFlightList(): Promise<FlightInfo[]> {
    // 国内直飞
    let directFlightList = await this.page.$$('.search_box.Label_Flight .search_table_header');

    await Promise.all(
      directFlightList.map(async directFlight => {
        let creator = new DirectFlightCreator(directFlight);
        let flightInfo = await creator.createFlightInfo();
        this.flightList.push(flightInfo);
      })
    );

    // 国内中转
    let stopFlightList = await this.page.$$('.search_box.Label_Transit .search_transfer_header');
    await Promise.all(
      stopFlightList.map(async (stopFlight, i) => {
        let creator = new StopFlightCreator(stopFlight, this.page);
        let flightInfo = await creator.createFlightInfo();
        this.flightList.push(flightInfo);
      })
    );
    return this.flightList;
  }

  async fromAirportName(): Promise<string> {
    return await this.page.evaluate(() => {
      let input = <HTMLInputElement>document.querySelector('#dcity0');
      return input && input.value;
    });
  }

  async toAirportName(): Promise<string> {
    return await this.page.evaluate(() => {
      let input = <HTMLInputElement>document.querySelector('#acity0');
      return input && input.value;
    });
  }
}
