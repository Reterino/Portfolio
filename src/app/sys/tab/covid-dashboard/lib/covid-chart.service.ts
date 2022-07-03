import { Injectable }                                                               from '@angular/core';
import { CovidDeathsIntf, CovidKPITicker, CovidKPITickerIntf, CovidTotalsDataIntf } from './covid-types';
import { CovidDataLoaderService }                                                   from './covid-data-loader.service';
import * as moment                                                                  from 'moment';
import { ChartWrapper, ChartWrapperIntf }                                           from '../../../../lib/types/lib-types';
import { ChartBuilderService }                                                      from '../../../../lib/utils/chart-builder.service';




@Injectable({
	            providedIn: 'root'
            })
export class CovidChartService {

	kpiTickers: CovidKPITickerIntf[] = [
		new CovidKPITicker('Total Cases'),
		new CovidKPITicker('Total Deaths'),
		new CovidKPITicker('Active Cases'),
		new CovidKPITicker('Daily New Cases'),
		new CovidKPITicker('Daily Deaths')
	];

	covidCharts: ChartWrapperIntf[] = [
		new ChartWrapper(this.chartBuilderSvc.buildDefaultChartOptions('details', false, {
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
		new ChartWrapper(this.chartBuilderSvc.buildDefaultChartOptions('details', false, {
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
		}), 'Total Deaths', 'All time', 'line'),
		new ChartWrapper(this.chartBuilderSvc.buildDefaultChartOptions('details', false, {
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
		}), 'Age Breakdown', 'From 29th June, 2021')
	];

	covidTotalChart: ChartWrapperIntf = new ChartWrapper(
			this.chartBuilderSvc.buildDefaultChartOptions('summary', false, {
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
			private chartBuilderSvc: ChartBuilderService
	) {
		this.covidDataSvc.dataLoaded.subscribe(() => this.start());
	}

	private start() {
		this.createKPITickerData();
		this.createChartData();
		this.modifyChartOptions();
	}

	private createChartData() {
		let newCasesMonth = this.covidCharts.find(d => d.title === 'New Cases')!;
		let deathsTotal = this.covidCharts.find(d => d.title === 'Total Deaths')!;
		let casesByAge = this.covidCharts.find(d => d.title === 'Age Breakdown')!;

		let monthDailyTotals = this.covidDataSvc.covidTotals.dailyTotals.filter((_d, i, a) => i > a.length - 30);
		newCasesMonth.dataset = [
			{
				data: monthDailyTotals.map(d => d.cases)
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
				data: deathsTotalData
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
				data: casesByAgeData
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
				data: casesTotalData
			}
		];
	}

	private modifyChartOptions() {
		let newCasesMonth = this.covidCharts.find(d => d.title === 'New Cases')!;
		let deathsMonth = this.covidCharts.find(d => d.title === 'Total Deaths')!;
		let casesByAge = this.covidCharts.find(d => d.title === 'Age Breakdown')!;
		let casesTotal = this.covidTotalChart;

		casesByAge.options.scales!['x']!.ticks!.callback = (_tickValue, index) => {
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

	private createKPITickerData() {
		let totalCasesKPI = this.kpiTickers.find(d => d.label === 'Total Cases')!;
		let totalDeathsKPI = this.kpiTickers.find(d => d.label === 'Total Deaths')!;
		let activeCasesKPI = this.kpiTickers.find(d => d.label === 'Active Cases')!;
		let newDayCasesKPI = this.kpiTickers.find(d => d.label === 'Daily New Cases')!;
		let dailyDeathsKPI = this.kpiTickers.find(d => d.label === 'Daily Deaths')!;

		let maxDate = moment('1/1/2000');
		let currDayCases = 0;
		let lastDayCases = 0;
		let activeCases = 0;
		let lastActiveCases = 0;
		let totalCases = 0;
		this.covidDataSvc.covidTotals.dailyTotals.forEach(d => {
			let date = moment(d.notification_date);
			if (date.diff(maxDate) > 0) {
				maxDate = date;
			}
		});
		this.covidDataSvc.covidTotals.dailyTotals.forEach(d => {
			totalCases += d.cases;
			let date = moment(d.notification_date);

			if (date.diff(maxDate) >= -(86401 * 28 * 1000)) {
				if (date.diff(maxDate) >= -(86401 * 14 * 1000)) {
					activeCases += d.cases;
				} else {
					lastActiveCases += d.cases;
				}
			}

			if (date.diff(maxDate) >= -(86401 * 2 * 1000)) {
				if (date.diff(maxDate) >= -(86401 * 1000)) {
					currDayCases += d.cases;
				} else {
					lastDayCases += d.cases;
				}
			}
		});
		newDayCasesKPI.value = currDayCases.toLocaleString();
		let percentage = ((currDayCases - lastDayCases) / lastDayCases) * 100;
		this.percentageKPI(newDayCasesKPI, percentage);
		newDayCasesKPI.arrowTooltip = (percentage > 0 ? 'Increased' : 'Decreased') + ' by ' + percentage.toFixed(1) + '%';

		activeCasesKPI.value = activeCases.toLocaleString();
		percentage = ((activeCases - lastActiveCases) / lastActiveCases) * 100;
		this.percentageKPI(activeCasesKPI, percentage);
		activeCasesKPI.arrowTooltip = (percentage > 0 ? 'Increased' : 'Decreased') + ' by ' + percentage.toFixed(1) + '%';

		totalCasesKPI.value = totalCases.toLocaleString();
		totalCasesKPI.arrow = 'up';
		totalCasesKPI.color = 'rag3';

		let finishDate = moment()
				.add(-2, 'days');
		totalDeathsKPI.value = Number(this.covidDataSvc.covidDeathsNSW[0][finishDate.format('M/D/YY') as keyof CovidDeathsIntf])
				.toLocaleString();
		totalDeathsKPI.arrow = 'up';
		totalDeathsKPI.color = 'rag3';

		let currDailyDeaths = Number(this.covidDataSvc.covidDeathsNSW[0][finishDate.format('M/D/YY') as keyof CovidDeathsIntf]) - Number(this.covidDataSvc.covidDeathsNSW[0][finishDate.add(-1, 'days')
		                                                                                                                                                                               .format('M/D/YY') as keyof CovidDeathsIntf]);
		let lastDailyDeaths = Number(this.covidDataSvc.covidDeathsNSW[0][finishDate.format('M/D/YY') as keyof CovidDeathsIntf]) - Number(this.covidDataSvc.covidDeathsNSW[0][finishDate.add(-1, 'days')
		                                                                                                                                                                               .format('M/D/YY') as keyof CovidDeathsIntf]);
		dailyDeathsKPI.value = currDailyDeaths.toLocaleString();
		percentage = ((currDailyDeaths - lastDailyDeaths) / lastDailyDeaths) * 100;
		this.percentageKPI(dailyDeathsKPI, percentage);
		dailyDeathsKPI.arrowTooltip = (percentage > 0 ? 'Increased' : 'Decreased') + ' by ' + percentage.toFixed(1) + '%';
	}

	private percentageKPI(kpi: CovidKPITickerIntf, perc: number) {
		if (perc > 5) {
			kpi.arrow = 'up';
			kpi.color = 'rag3';
		}
		if (perc <= 5 && perc >= -5) {
			kpi.arrow = 'neutral';
			kpi.color = 'rag2';
		}
		if (perc < -5) {
			kpi.arrow = 'down';
			kpi.color = 'rag1';
		}
	}
}
