import { Injectable }     from '@angular/core';
import * as tinycolor from 'tinycolor2';



@Injectable({
	            providedIn: 'root'
            })
export class CovidThemeService {

	constructor() { }

	start() {
		let tints = [ 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 ];
		tints.forEach(tint => {
			document.documentElement.style.setProperty(`--theme-${tint}`, tinycolor('neutral-'+tint).toRgbString());
		});
	}
}
