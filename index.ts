import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Task } from './src/task/task';

let stat = promisify(fs.stat);
let mkdir = promisify(fs.mkdir);
(async () => {
  let resultFolder = path.join(__dirname, '../result');
  try {
    await stat(resultFolder);
  } catch (error) {
    await mkdir(resultFolder);
  }
  const browser = await puppeteer.launch({
    headless: false
  });
  let task = new Task(browser);
  try {
    await task.run('HLD', 'TYN', '2018-04-17');
    await task.run('tao', 'syd', '2018-04-17');
    // await task.run('tao', 'syd', '2018-04-17');
  } catch (error) {
    console.log(error);
  }
  await browser.close();
})();
