import { Injectable }             from '@angular/core';
import { CovidDataLoaderService } from './covid-data-loader.service';
import * as moment                from 'moment';
import { BehaviorSubject }        from 'rxjs';
import { CovidLGATotalsIntf }     from './covid-types';




@Injectable({
	            providedIn: 'root'
            })
export class CovidTimeDataService {

	minDate = moment();
	maxDate = moment('2001-01-01', 'YYYY-MM-DD');

	currentDate = moment('Invalid Date');
	currentDateData: BehaviorSubject<CovidLGATotalsIntf[]> = new BehaviorSubject<CovidLGATotalsIntf[]>([]);

	lgaSet: string[] = [];

	intervalRef: number | undefined = undefined;

	constructor(
			private covidDataLdSvc: CovidDataLoaderService
	) {
		this.covidDataLdSvc.dataLoaded.subscribe(() => {
			this.initTimeSeries();
		});
	}

	public goToStart() {
		this.currentDate = this.minDate;
	}

	public goToEnd() {
		this.currentDate = this.maxDate;
	}

	public startTimeline() {
		console.log(this.currentDate,this.maxDate,this.currentDate.diff(this.maxDate,'days'))
		if (Math.abs(this.currentDate.diff(this.maxDate,'days')) < 1) {
			this.currentDate = this.minDate;
		}
		this.nextDay();
		this.intervalRef = setInterval(() => this.nextDay(), 1000);
	}

	public pauseTimeline() {
		clearInterval(this.intervalRef);
		this.intervalRef = undefined;
	}

	private initTimeSeries() {
		this.covidDataLdSvc.covidByLocationData.forEach(d => {
			let date = moment(d.notification_date, 'YYYY-MM-DD');
			if (date.diff(this.minDate) < 0) {
				this.minDate = date;
			}
			if (date.diff(this.maxDate) > 0) {
				this.maxDate = date;
			}
			this.lgaSet.push(d.lga_name19);
		});
		this.lgaSet = Array.from(new Set(this.lgaSet));
		this.currentDate = this.maxDate;
	}

	private nextDay() {
		if (Math.abs(this.currentDate.diff(this.maxDate,'days')) < 1) {
			this.pauseTimeline();
			return;
		}
		this.currentDate.add(1, 'days');

		let filteredData = this.covidDataLdSvc.covidByLocationData.filter(d => d.notification_date === this.currentDate.format('YYYY-MM-DD'));

		let data: CovidLGATotalsIntf[] = this.lgaSet.map(lgaName => {
			let d = filteredData.find(filt => filt.lga_name19 === lgaName);
			return {
				lga_name19: this.covidDataLdSvc.formatLGAName(lgaName),
				lga_code19: d?.lga_code19 || '',
				cases     : Number(d?.confirmed_cases_count || 0)
			};
		});

		this.currentDateData.next(data);
	}

	private getDayData(date: moment.Moment) {
		let filteredData = this.covidDataLdSvc.covidByLocationData.filter(d => d.notification_date === date.format('YYYY-MM-DD'));

		let data: CovidLGATotalsIntf[] = this.lgaSet.map(lgaName => {
			let d = filteredData.find(filt => filt.lga_name19 === lgaName);
			return {
				lga_name19: this.covidDataLdSvc.formatLGAName(lgaName),
				lga_code19: d?.lga_code19 || '',
				cases     : Number(d?.confirmed_cases_count || 0)
			};
		});

		this.currentDateData.next(data);
	}
}
