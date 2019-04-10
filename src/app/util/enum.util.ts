import { Injectable } from 'ngx-onsenui';

@Injectable()
export class EnumUtil {
  indexes(target: any) {
    const arr = [];
    for (const key in target) {
      if (!isNaN(Number(key))) {
        arr.push(key);
      }
    }
    return arr;
  }
}
