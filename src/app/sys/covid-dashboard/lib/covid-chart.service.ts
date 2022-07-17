import { Injectable }                           from '@angular/core';
import { CovidDeathsIntf, CovidTotalsDataIntf } from './covid-types';
import { CovidDataLoaderService }               from './covid-data-loader.service';
import * as moment                              from 'moment';
import { ChartWrapper, ChartWrapperIntf }       from '../../../lib/types/lib-types';
import { ChartBuilderService }                  from '../../../lib/utils/chart-builder.service';
import { UiThemeService }                       from '../../../lib/utils/ui-theme.service';




@Injectable({
	            providedIn: 'root'
            })
export class CovidChartService {
	covidCharts: ChartWrapperIntf[] = [
		new ChartWrapper(this.chartBuilderSvc.buildDefaultChartOptions(
				'details', false, {
					x: {
						stacked: false,
						ticks  : false,
						grid   : true
					},
					y: {
						stacked: false,
						ticks  : true,
						grid   : true
					}
				}), 'New Cases', 'Past 30 days'),
		new ChartWrapper(this.chartBuilderSvc.buildDefaultChartOptions(
				'details', false, {
					x: {
						stacked: false,
						ticks  : true,
						grid   : true
					},
					y: {
						stacked: false,
						ticks  : true,
						grid   : true
					}
				}), 'Age Breakdown', 'From 29th June, 2021'),
		new ChartWrapper(this.chartBuilderSvc.buildDefaultChartOptions(
				'details', false, {
					x: {
						stacked: false,
						ticks  : false,
						grid   : true
					},
					y: {
						stacked: false,
						ticks  : true,
						grid   : true
					}
				}), 'Total Deaths', 'All time', 'line')
	];

	covidTotalChart: ChartWrapperIntf = new ChartWrapper(
			this.chartBuilderSvc.buildDefaultChartOptions(
					'summary', false, {
						x: {
							stacked: false,
							ticks  : false,
							grid   : false
						},
						y: {
							stacked: false,
							ticks  : false,
							grid   : false
						}
					}), 'Total Cases', 'All time', 'line');

	constructor(
			private covidDataSvc: CovidDataLoaderService,
			private chartBuilderSvc: ChartBuilderService,
			private uiThemeSvc: UiThemeService
	) {
		this.modifyChartOptions();
		this.covidDataSvc.dataLoaded.subscribe(() => this.start());
	}

	private start() {
		this.createChartData();
	}

	private createChartData() {
		let newCasesMonth = this.covidCharts.find(d => d.title === 'New Cases')!;
		let deathsTotal = this.covidCharts.find(d => d.title === 'Total Deaths')!;
		let casesByAge = this.covidCharts.find(d => d.title === 'Age Breakdown')!;

		let monthDailyTotals = this.covidDataSvc.covidTotals.dailyTotals.filter((_d, i, a) => i > a.length - 30);
		newCasesMonth.dataset = [
			{
				data                : monthDailyTotals.map(d => d.cases),
				backgroundColor     : (context: any) => this.chartBuilderSvc.chartGradientColor(context, this.uiThemeSvc.getColorCode('purple', '50'), this.uiThemeSvc.getColorCode('purple', '400'), 'v'),
				hoverBackgroundColor: (context: any) => this.chartBuilderSvc.chartGradientColor(context, this.uiThemeSvc.getColorCode('purple', '400'), this.uiThemeSvc.getColorCode('purple', '800'), 'v'),
				borderColor         : (context: any) => this.chartBuilderSvc.chartGradientColor(context, this.uiThemeSvc.getColorCode('purple', '500'), this.uiThemeSvc.getColorCode('purple', '900'), 'v'),
				borderWidth         : 1
			}
		];
		newCasesMonth.labels = monthDailyTotals.map(d => d.notification_date);

		let startDate = moment('1/22/20', 'M/DD/YY');
		let finishDate = moment()
				.add(-2, 'days');
		let deathsTotalLabels: string[] = [];
		let deathsTotalData: number[] = [];
		while (startDate.diff(finishDate) < 0) {
			deathsTotalLabels.push(startDate.format('YYYY-MM-DD'));
			deathsTotalData.push(Number(this.covidDataSvc.covidDeathsNSW[0][startDate.format('M/D/YY') as keyof CovidDeathsIntf]));
			startDate.add(1, 'days');
		}
		deathsTotal.labels = deathsTotalLabels;
		deathsTotal.dataset = [
			{
				data: deathsTotalData,
				...this.chartBuilderSvc.buildChartColors('green', 'red', 'h', true, 'line')
			}
		];

		let casesByAgeData: number[] = [];
		let casesByAgeLabels: string[] = [];
		let keys: (keyof CovidTotalsDataIntf)[] = [ 'AgeGroup_0-19', 'AgeGroup_20-24', 'AgeGroup_25-29', 'AgeGroup_30-34', 'AgeGroup_35-39', 'AgeGroup_40-44', 'AgeGroup_45-49', 'AgeGroup_50-54', 'AgeGroup_55-59', 'AgeGroup_60-64', 'AgeGroup_65-69', 'AgeGroup_70+', 'AgeGroup_None' ];
		keys.forEach(d => {
			if (d.includes('None')) {
				casesByAgeLabels.push('Age Bracket: None Given');
			} else {
				casesByAgeLabels.push(d.replace('AgeGroup_', 'Age Bracket: '));
			}
			casesByAgeData.push(this.covidDataSvc.covidTotals[d] as number);
		});
		casesByAge.labels = casesByAgeLabels;
		casesByAge.dataset = [
			{
				data: casesByAgeData,
				...this.chartBuilderSvc.buildChartColors('blue', 'blue', 'v', true)
			}
		];

		let casesTotal = this.covidTotalChart;
		let casesTotalLabels: string[] = [];
		let casesTotalData: number[] = [];
		let runningTotal = 0;
		this.covidDataSvc.covidTotals.dailyTotals.forEach(d => {
			casesTotalLabels.push(d.notification_date);
			runningTotal += d.cases;
			casesTotalData.push(runningTotal);
		});
		casesTotal.labels = casesTotalLabels;
		casesTotal.dataset = [
			{
				data: casesTotalData,
				...this.chartBuilderSvc.buildChartColors('green', 'red', 'h', true, 'line')
			}
		];
	}

	private modifyChartOptions() {
		let newCasesMonth = this.covidCharts.find(d => d.title === 'New Cases')!;
		let deathsTotal = this.covidCharts.find(d => d.title === 'Total Deaths')!;
		let casesByAge = this.covidCharts.find(d => d.title === 'Age Breakdown')!;
		let casesTotal = this.covidTotalChart;

		casesByAge.options.scales!['x']!.ticks!.callback = (_, index) => {
			return casesByAge.labels[index].replace('Age Bracket: ', '')
			                               .replace('None Given', 'None');
		};

		casesTotal.options.elements = {
			point: {
				radius: 0
			},
			line : {
				tension: 1
			}
		};
	}
}
