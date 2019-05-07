import { Pipe, PipeTransform } from '@angular/core';

import { PlanTheme } from '../constant/plan-theme';

@Pipe({
  name: 'themeImg'
})
export class ThemeImgPipe implements PipeTransform {
  transform(theme: PlanTheme, component: number): string {
    return './assets/' + theme.name + '.jpg';
  }
}
