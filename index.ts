import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { Task } from './src/task/task';
import { Schedule } from './src/task/schedule';
import { Browser } from 'puppeteer';
// import * as readlineSync from 'readline-sync';
// import { formatDate } from './src/util/util';
import { newFolder } from './src/util/file-util';

let readFile = promisify(fs.readFile);

(async () => {
  let cf = await readFile(path.join(__dirname, '../config/config.txt'));
  let config = cf.toString().split('\n');

  let date = config[1];
  let thread = parseInt(config[3]);
  let headless = config[5] == 'Y' ? false : true;

  console.log(`加载配置文件${date}, ${headless}, ${thread}`);

  // headless = !readlineSync.keyInYNStrict('你是否想要观看爬取过程?');
  // date = readlineSync.question(`输入要抓取的航班日期(默认${date}): `, { defaultInput: date });

  let resultFolder = path.join(__dirname, '../result');
  await newFolder(resultFolder);
  let subFolder = path.join(resultFolder, date);
  await newFolder(subFolder);

  const browser = await puppeteer.launch({ headless: headless, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  await login(browser);
  let fs1 = await readFile(path.join(__dirname, '../config/from-airport.txt'));
  let fs2 = await readFile(path.join(__dirname, '../config/to-airport.txt'));
  let fromList = fs1.toString().split('\n');
  let toList = fs2.toString().split('\n');

  console.log(`找到起飞机场${fromList.length}个，目的机场${toList.length}个`);

  let taskList: Task[] = [];
  try {
    for (var i = 0; i < fromList.length; i++) {
      for (var j = 0; j < toList.length; j++) {
        if (fromList[i] != toList[j]) {
          let task = new Task(browser, fromList[i], toList[j], date);
          taskList.push(task);
        }
      }
    }
    console.log(`开始执行任务`);

    let schedule = new Schedule(taskList);
    // 如果观看的话，一次只执行一个任务
    await schedule.start(headless ? thread : 1);
    await browser.close();
  } catch (error) {
    console.log(error);
  }

  async function login(browser: Browser) {
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    await page.goto('https://passport.ctrip.com/user/login?BackUrl=http%3A%2F%2Fwww.ctrip.com%2F');
    let username = '18936040203';
    let password = '18936040203';
    await page.type('#nloginname', username, { delay: 0 });
    await page.type('#npwd', password, { delay: 0 });
    let button = await page.$('#nsubmit');
    await button.click();
    await page.waitFor(500);
    await page.close();
  }
})();
