import { EventEmitter, Injectable }                                                                                          from '@angular/core';
import { HttpClient }                                                                                                        from '@angular/common/http';
import { CovidByAgeDailyIntf, CovidByLocationDailyIntf, CovidDeathsIntf, CovidTotalsData, CovidTotalsDataIntf, LGAInfoIntf } from './covid-types';
import { Papa }                                                                                                              from 'ngx-papaparse';




@Injectable({
	            providedIn: 'root'
            })
export class CovidDataLoaderService {

	public lgaNSWInfo: LGAInfoIntf[] = [];
	public covidByAgeData: CovidByAgeDailyIntf[] = [];
	public covidByLocationData: CovidByLocationDailyIntf[] = [];
	public covidDeathsNSW: CovidDeathsIntf[] = [];
	public covidTotals: CovidTotalsDataIntf = new CovidTotalsData();
	public dataLoaded: EventEmitter<any> = new EventEmitter<any>();

	constructor(
			private http: HttpClient,
			private papa: Papa
	) {
		this.start();
	}

	formatLGAName(lga_name: string): string {
		if (lga_name.includes('Unincorporated')) {
			return 'UNINCORPORATED - FAR WEST AREA';
		}
		if (lga_name.includes('Warrumbungle')) {
			return 'WARRUMBUNGLE';
		}
		if (lga_name.includes('Lithgow')) {
			return 'LITHGOW CITY';
		}
		if (lga_name.includes('Upper Hunter Shire')) {
			return 'UPPER HUNTER';
		}
		if (lga_name.includes('Nambucca')) {
			return 'NAMBUCCA VALLEY';
		}
		if (lga_name.includes('Parramatta')) {
			return 'CITY OF PARRAMATTA';
		}
		if (lga_name.includes('Albury')) {
			return 'ALBURY CITY';
		}
		return lga_name.split('(')[0].trim()
		                             .toUpperCase();
	}

	private start() {
		let lgaNSW_Population = 'assets/data/lgaNSW_Population.csv';
		this.papa.parse(lgaNSW_Population, {
			download: true,
			header  : true,
			complete: (result) => {
				this.lgaNSWInfo = result.data;
			}
		});
		let covidByAgeFormatted = 'assets/data/covidByAgeFormatted.csv';
		this.papa.parse(covidByAgeFormatted, {
			download: true,
			header  : true,
			complete: (result) => {
				this.covidByAgeData = result.data;
				this.covidByAgeData = this.covidByAgeData.filter(d => !!d.notification_date);
				this.parseCovidData();
			}
		});
		let covidByLocationFormatted = 'assets/data/covidByLocationFormatted.csv';
		this.papa.parse(covidByLocationFormatted, {
			download: true,
			header  : true,
			complete: (result) => {
				this.covidByLocationData = result.data;
				this.covidByLocationData = this.covidByLocationData.filter(d => !!d.notification_date);
				this.parseCovidData();
			}
		});
		let covidDeathsNSW = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';
		this.papa.parse(covidDeathsNSW, {
			download: true,
			header  : true,
			complete: (result) => {
				this.covidDeathsNSW = (result.data as CovidDeathsIntf[]).filter(d => d['Province/State'] === 'New South Wales');
				this.parseCovidData();
			}
		});
	}

	private parseCovidData() {
		if (this.covidByAgeData.length > 0 && this.covidByLocationData.length > 0) {
			this.covidByAgeData.forEach(d => {
				let keys: (keyof CovidByAgeDailyIntf)[] = [
					'AgeGroup_0-19',
					'AgeGroup_20-24',
					'AgeGroup_25-29',
					'AgeGroup_30-34',
					'AgeGroup_35-39',
					'AgeGroup_40-44',
					'AgeGroup_45-49',
					'AgeGroup_50-54',
					'AgeGroup_55-59',
					'AgeGroup_60-64',
					'AgeGroup_65-69',
					'AgeGroup_70+',
					'AgeGroup_None'
				];
				keys.forEach(key => {
					let val = Number(d[key]);
					this.covidTotals.totalCases += val;
					// @ts-ignore
					this.covidTotals[key as keyof CovidTotalsDataIntf] += val;
				});
			});
			this.covidByLocationData.forEach(d => {
				let index = this.covidTotals.lgaTotals.findIndex(l => l.lga_code19 === d.lga_code19);
				if (index === -1) {
					this.covidTotals.lgaTotals.push({
						                                lga_code19: d.lga_code19,
						                                lga_name19: this.formatLGAName(d.lga_name19),
						                                cases     : Number(d.confirmed_cases_count)
					                                });
				} else {
					this.covidTotals.lgaTotals[index].cases += Number(d.confirmed_cases_count);
				}
				let dayIndex = this.covidTotals.dailyTotals.findIndex(l => l.notification_date === d.notification_date);
				if (dayIndex === -1) {
					this.covidTotals.dailyTotals.push({
						                                  notification_date: d.notification_date,
						                                  cases            : Number(d.confirmed_cases_count)
					                                  });
				} else {
					this.covidTotals.dailyTotals[dayIndex].cases += Number(d.confirmed_cases_count);
				}
			});
			this.covidTotals.lgaTotals.sort((a, b) => a.lga_name19.localeCompare(b.lga_name19));
			this.dataLoaded.emit();
		}
	}
}