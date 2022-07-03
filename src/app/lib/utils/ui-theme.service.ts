import { Injectable } from '@angular/core';
import * as tinycolor from 'tinycolor2';

//@ts-ignore
import * as tailwindConfig from '../../../../tailwind.config.js';
import resolveConfig       from 'tailwindcss/resolveConfig';

export const tailwind = resolveConfig(tailwindConfig);


@Injectable({
  providedIn: 'root'
})
export class UiThemeService {

  constructor() { }

	getColorCode(code: string, tint: number | false, a: number = 1): string {
		//@ts-ignore
		return tinycolor(tint ? tailwind.theme.colors[code][tint] : tailwind.theme.colors[code]).setAlpha(a).toRgbString();
	}
}
