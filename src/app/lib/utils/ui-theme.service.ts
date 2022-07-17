import { Injectable } from '@angular/core';
import * as tinycolor                          from 'tinycolor2';
import { TailwindColorType, TailwindTintType } from '../types/lib-types';
import * as colors                             from 'tailwindcss/colors'


@Injectable({
  providedIn: 'root'
})
export class UiThemeService {

  constructor() { }

	getColorCode(code: TailwindColorType, tint: TailwindTintType, a: number = 1): string {
		return tinycolor(colors[code][tint] ).setAlpha(a).toRgbString();
	}
}
