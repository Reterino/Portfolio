import { Injectable }        from '@angular/core';
import { ChartOptions }      from 'chart.js';
import { UiThemeService }    from './ui-theme.service';
import { TailwindColorType } from '../types/lib-types';




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
			scales: ChartScalesIntf,
	): ChartOptions {
		return {
			maintainAspectRatio: false,
			responsive         : true,
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
						display    : scales.x.ticks,
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
						color      : this.uiThemeSvc.getColorCode('neutral', '400'),
						align      : 'center'
					},
					grid   : {
						display    : scales.x.grid,
						drawTicks  : type === 'details',
						tickLength : 9,
						borderColor: this.uiThemeSvc.getColorCode('neutral', '800'),
						color      : this.uiThemeSvc.getColorCode('neutral', '800', 0.25),
					},
				},
				y: {
					display: type === 'details',
					stacked: scales.y.stacked,
					ticks  : {
						display    : scales.y.ticks,
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
						color      : this.uiThemeSvc.getColorCode('neutral', '400'),
						align      : 'center',
						callback   : (tickValue, index, ticks) => {
							return (index === 0 || (index + 1) === ticks.length) ? '' : tickValue;
						}
					},
					grid   : {
						display    : scales.y.grid,
						drawTicks  : type === 'details',
						tickLength : 9,
						borderColor: this.uiThemeSvc.getColorCode('neutral', '800'),
						color      : this.uiThemeSvc.getColorCode('neutral', '800', 0.25)
					}
				}
			}
		};
	}

	chartGradientColor(context: any, color1: string, color2: string, direction: 'h' | 'v' = 'h') {
		const chart = context.chart;
		const {
			      ctx,
			      chartArea
		      } = chart;
		if (!chartArea) {
			return null;
		}
		const width = chartArea.right - chartArea.left;
		const height = chartArea.bottom - chartArea.top;
		let gradient;
		if (direction === 'h') {
			gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
		} else {
			gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
		}
		gradient.addColorStop(0, color1);
		gradient.addColorStop(1, color2);
		return gradient;
	}

	public buildChartColors(color1: TailwindColorType, color2: TailwindColorType, direction: 'h' | 'v' = 'h', darkMode: boolean = true, type: 'bar' | 'line' | 'donut' = 'bar') {
		if (type === 'bar') {
			return {
				backgroundColor     : (context: any) => this.chartGradientColor(context, this.uiThemeSvc.getColorCode(color1, darkMode ? '50' : '500'), this.uiThemeSvc.getColorCode(color2, darkMode ? '400' : '900'), direction),
				hoverBackgroundColor: (context: any) => this.chartGradientColor(context, this.uiThemeSvc.getColorCode(color1, darkMode ? '400' : '50'), this.uiThemeSvc.getColorCode(color2, darkMode ? '800' : '400'), direction),
				borderColor         : (context: any) => this.chartGradientColor(context, this.uiThemeSvc.getColorCode(color1, darkMode ? '500' : '300'), this.uiThemeSvc.getColorCode(color2, darkMode ? '900' : '700'), direction),
				borderWidth         : 1
			};
		}
		if (type === 'line') {
			return {
				backgroundColor     : (context: any) => this.chartGradientColor(context, this.uiThemeSvc.getColorCode(color1, darkMode ? '50' : '500'), this.uiThemeSvc.getColorCode(color2, darkMode ? '400' : '900'), direction),
				hoverBackgroundColor: (context: any) => this.chartGradientColor(context, this.uiThemeSvc.getColorCode(color1, darkMode ? '400' : '50'), this.uiThemeSvc.getColorCode(color2, darkMode ? '800' : '400'), direction),
				borderColor         : (context: any) => this.chartGradientColor(context, this.uiThemeSvc.getColorCode(color1, darkMode ? '500' : '300'), this.uiThemeSvc.getColorCode(color2, darkMode ? '900' : '700'), direction),
				borderWidth         : 1,
				pointRadius         : 0
			};
		}
		if (type === 'donut') {
			return {};
		}
		return {};
	}
}
