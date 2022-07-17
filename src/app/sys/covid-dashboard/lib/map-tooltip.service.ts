import { Injectable }                                          from '@angular/core';
import * as moment                                             from 'moment';
import { CovidDeathsIntf, CovidKPITicker, CovidKPITickerIntf } from './covid-types';
import { CovidDataLoaderService }                              from './covid-data-loader.service';
import { ChartBuilderService }                                 from '../../../lib/utils/chart-builder.service';
import { UiThemeService }                                      from '../../../lib/utils/ui-theme.service';
import { ArcgisMapCreationService }                            from './arcgis-map-creation.service';




@Injectable({
	            providedIn: 'root'
            })
export class MapTooltipService {

	kpiTickers: CovidKPITickerIntf[] = [
		new CovidKPITicker('Total Cases'),
		new CovidKPITicker('Total Deaths'),
	];

	clickedLGAName: string = '';

	constructor(
			private covidDataSvc: CovidDataLoaderService,
			private chartBuilderSvc: ChartBuilderService,
			private uiThemeSvc: UiThemeService,
			private arcgisMapSvc: ArcgisMapCreationService
	) {
		this.arcgisMapSvc.clickedLGA.subscribe(d => {
			this.clickedLGAName = d;
			if (d) {
				this.start();
			}
		});
		this.covidDataSvc.dataLoaded.subscribe(() => this.start());
	}

	reset() {
		this.clickedLGAName = '';
		this.arcgisMapSvc.resetHighlight();
		this.start();
	}

	private start() {
		this.createKPITickerData();
	}

	private createKPITickerData() {
		let totalCasesKPI = this.kpiTickers.find(d => d.label === 'Total Cases')!;
		let totalDeathsKPI = this.kpiTickers.find(d => d.label === 'Total Deaths')!;

		let maxDate = moment('1/1/2000');
		let totalCases = 0;
		this.covidDataSvc.covidTotals.dailyTotals.forEach(d => {
			totalCases += d.cases;
		});
		totalCasesKPI.value = totalCases.toLocaleString();
		totalCasesKPI.arrow = 'up';
		totalCasesKPI.color = 'rag3';

		let finishDate = moment()
				.add(-2, 'days');
		totalDeathsKPI.value = Number(this.covidDataSvc.covidDeathsNSW[0][finishDate.format('M/D/YY') as keyof CovidDeathsIntf])
				.toLocaleString();
		totalDeathsKPI.arrow = 'up';
		totalDeathsKPI.color = 'rag3';
	}
}
