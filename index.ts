import * as puppeteer from 'puppeteer';
import { Task } from './src/task/task';

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  let task = new Task(browser);
  try {
    await task.run('can', 'tcz', '2018-04-25');
  } catch (error) {
    console.log(error);
  }
  // await browser.close();
})();
