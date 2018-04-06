import { Task } from './task';
import { mapLimit } from 'async';

const TASK_LIMIT = 10;
export class Schedule {
  taskList: Task[];

  next_index: number = 0;

  constructor(taskList: Task[]) {
    this.taskList = taskList;
  }
  async start() {
    return new Promise(resolve => {
      mapLimit(
        this.taskList,
        TASK_LIMIT,
        async (task, callback) => {
          return Promise.race([
            await task.run(),
            new Promise(resolve => {
              setTimeout(() => {
                task.cancel();
                resolve();
              }, 30000);
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
