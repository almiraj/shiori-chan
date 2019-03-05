import { Pipe, PipeTransform } from '@angular/core';
import { PlanTheme } from '../entity/plan-theme';

@Pipe({
  name: 'themeImg'
})
export class ThemeImgPipe implements PipeTransform {
  transform(idx: number, component: number): string {
    return './assets/' + PlanTheme[idx] + '.jpg';
  }
}
