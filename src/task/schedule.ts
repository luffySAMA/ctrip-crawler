import { Task } from './task';
import { mapLimit } from 'async';

const TASK_LIMIT = 30;
export class Schedule {
  taskList: Task[];

  next_index: number = 0;

  constructor(taskList: Task[]) {
    this.taskList = taskList;
  }
  async start(max_task: number = 1) {
    return new Promise(resolve => {
      mapLimit(
        this.taskList,
        Math.min(max_task, TASK_LIMIT),
        async (task, callback) => {
          // await task.run();
          // callback();
          return Promise.race([
            await task.run(),
            new Promise(resolve => {
              setTimeout(() => {
                task.cancel();
                resolve();
              }, 60 * 1000);
            })
          ]).then(() => {
            callback();
          });
        },
        (err, results) => {
          resolve();
        }
      );
    });
  }
}
