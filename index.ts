import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Task } from './src/task/task';
import { Schedule } from './src/task/schedule';

let stat = promisify(fs.stat);
let mkdir = promisify(fs.mkdir);
let readFile = promisify(fs.readFile);
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
  let fs1 = await readFile(path.join(__dirname, '../airport/important-airport.txt'));
  let fs2 = await readFile(path.join(__dirname, '../airport/china-airport.txt'));
  let fromList = fs1.toString().split('\n');
  let toList = fs2.toString().split('\n');
  // let airport = ['CAN', 'SZX', 'HKG', 'MFM', 'ZUH', 'HUZ', 'FUO'];
  let taskList: Task[] = [];
  try {
    for (var i = 0; i < fromList.length; i++) {
      for (var j = 0; j < toList.length; j++) {
        if (i !== j) {
          let task = new Task(browser, fromList[i], toList[j], '2018-04-19');
          taskList.push(task);
        }
      }
    }
    let schedule = new Schedule(taskList);
    await schedule.start();
    await browser.close();
    // await task.run('tao', 'syd', '2018-04-17');
  } catch (error) {
    console.log(error);
  }
})();
