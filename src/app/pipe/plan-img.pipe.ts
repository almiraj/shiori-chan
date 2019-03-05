import { Pipe, PipeTransform } from '@angular/core';
import { PlanTheme } from '../entity/plan-theme';

@Pipe({
  name: 'planImg'
})
export class PlanImgPipe implements PipeTransform {
  transform(value: PlanTheme, component: number): string {
    return '../../assets/' + value.toString() + '.jpg';
  }
}
