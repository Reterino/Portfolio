import { Injectable }     from '@angular/core';
import { ChartOptions }   from 'chart.js';
import { UiThemeService } from './ui-theme.service';




export interface ChartScalesIntf {
	x: {
		stacked: boolean,
		ticks: boolean,
		grid: boolean
	},
	y: {
		stacked: boolean,
		ticks: boolean,
		grid: boolean
	},
}

@Injectable({
	            providedIn: 'root'
            })
export class ChartBuilderService {

	constructor(
			private uiThemeSvc: UiThemeService
	) { }

	buildDefaultChartOptions(
			type: 'summary' | 'details' = 'details',
			legend: boolean             = false,
			scales: ChartScalesIntf
	): ChartOptions {
		return {
			maintainAspectRatio: false,
			responsive         : true,
			layout             : {
				padding: 0
			},
			interaction        : {
				mode     : 'index',
				axis     : 'x',
				intersect: false
			},
			plugins            : {
				legend: {
					display: legend
				}
			},
			scales             : {
				x: {
					display: type === 'details',
					stacked: scales.x.stacked,
					ticks  : {
						display: scales.x.ticks,
						minRotation: 0,
						maxRotation: 0,
						mirror     : false,
						padding    : 1,
						font       : {
							size      : 9,
							family    : '\'Helvetica\',\'Roboto\', sans-serif',
							style     : 'normal',
							weight    : 'normal',
							lineHeight: 1
						},
						color      : this.uiThemeSvc.getColorCode('neutral', 400),
						align      : 'center'
					},
					grid   : {
						display: scales.x.grid,
						drawTicks  : type === 'details',
						tickLength : 9,
						borderColor: this.uiThemeSvc.getColorCode('neutral', 800),
						color      : this.uiThemeSvc.getColorCode('neutral', 800, 0.25)
					}
				},
				y: {
					display: type === 'details',
					stacked: scales.y.stacked,
					ticks  : {
						display: scales.y.ticks,
						minRotation: 0,
						maxRotation: 0,
						mirror     : false,
						padding    : 1,
						font       : {
							size      : 9,
							family    : '\'Helvetica\',\'Roboto\', sans-serif',
							style     : 'normal',
							weight    : 'normal',
							lineHeight: 1
						},
						color      : this.uiThemeSvc.getColorCode('neutral', 400),
						align      : 'center'
					},
					grid   : {
						display: scales.y.grid,
						drawTicks  : type === 'details',
						tickLength : 9,
						borderColor: this.uiThemeSvc.getColorCode('neutral', 800),
						color      : this.uiThemeSvc.getColorCode('neutral', 800, 0.25)
					}
				}
			}
		};
	}
}
