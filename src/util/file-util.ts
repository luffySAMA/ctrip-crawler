import { promisify } from 'util';
import * as fs from 'fs';

let mkdir = promisify(fs.mkdir);
let stat = promisify(fs.stat);

export async function isFileExist(fileName: string) {
  try {
    await stat(fileName);
    return true;
  } catch (error) {
    return false;
  }
}

export async function newFolder(filePath: string) {
  let isExist = await isFileExist(filePath);
  if (!isExist) {
    mkdir(filePath);
  }
}
