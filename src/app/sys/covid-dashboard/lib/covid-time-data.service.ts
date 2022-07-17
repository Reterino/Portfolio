import { Injectable }             from '@angular/core';
import { CovidDataLoaderService } from './covid-data-loader.service';
import * as moment                from 'moment';
import { BehaviorSubject }        from 'rxjs';
import { CovidLGATotalsIntf }     from './covid-types';
import * as d3                    from 'd3';
import Chart                      from 'chart.js/auto';




@Injectable({
	            providedIn: 'root'
            })
export class CovidTimeDataService {

	public minDate = moment();
	public maxDate = moment('2001-01-01', 'YYYY-MM-DD');
	public currentDate = moment('Invalid Date');
	public currentDateData: BehaviorSubject<CovidLGATotalsIntf[]> = new BehaviorSubject<CovidLGATotalsIntf[]>([]);
	public intervalRef: number | undefined = undefined;
	private lgaSet: string[] = [];

	private mediaSliderScale: Function = d3.scaleLinear;
	private mediaSliderClickScale: Function = d3.scaleLinear;

	constructor(
			private covidDataLdSvc: CovidDataLoaderService
	) {
		this.covidDataLdSvc.dataLoaded.subscribe(() => {
			this.initTimeSeries();
		});
	}

	public goToStart() {
		this.currentDate = this.minDate.clone();
		this.getDayData(this.currentDate);
		this.moveMediaSlider();
	}

	public goToEnd() {
		this.currentDate = this.maxDate.clone();
		this.getDayData(this.currentDate);
		this.moveMediaSlider();
	}

	public startTimeline() {
		if (Math.abs(this.currentDate.diff(this.maxDate, 'days')) < 1) {
			this.currentDate = this.minDate.clone();
		}
		this.nextDay();
		this.intervalRef = setInterval(() => this.nextDay(), 1000);
	}

	public pauseTimeline() {
		clearInterval(this.intervalRef);
		this.intervalRef = undefined;
	}

	changeTimeByChartClick(event: any, element: any[]) {
		let x = event.x;

		let svgBox = document.getElementById('TimelineMediaBar')!;

		let svg = d3.select(svgBox);

		const rect = svg.select('rect');
		rect.attr('transform', `translate(${x})`);

		this.currentDate = this.minDate.clone().add(element[0].index,'days');
		this.getDayData(this.currentDate);
	}

	private initTimeSeries() {
		this.minDate = this.covidDataLdSvc.minDate.clone();
		this.maxDate = this.covidDataLdSvc.maxDate.clone();
		this.lgaSet = this.covidDataLdSvc.lgaSet;
		this.currentDate = this.maxDate.clone();
		this.initMediaSlider();
	}

	private nextDay() {
		if (Math.abs(this.currentDate.diff(this.maxDate, 'days')) < 1) {
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
		this.moveMediaSlider();
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

	private initMediaSlider() {
		let svgBox = document.getElementById('TimelineMediaBar')!;

		let width = svgBox.clientWidth;
		let height = svgBox.clientHeight;

		this.mediaSliderScale = d3.scaleLinear()
		                          .domain([ 0, this.maxDate.diff(this.minDate, 'days') ])
		                          .range([ 0, width - 4 ]);
		this.mediaSliderClickScale = d3.scaleLinear()
		                               .domain([ 0, width - 4 ])
		                               .range([ 0, this.maxDate.diff(this.minDate, 'days') ]);

		let svg = d3.select(svgBox);
		svg.selectAll('*')
		   .remove();

		const rectG = svg.append('g')
		                 .attr('width', '100%')
		                 .attr('height', '12rem');

		rectG.append('rect')
		     .attr('x', 0)
		     .attr('y', 0)
		     .attr('width', 4)
		     .attr('height', '100%')
		     .attr('class', 'transition-all duration-1000')
		     .attr('transform', `translate(${this.mediaSliderScale(this.currentDate.diff(this.minDate, 'days'))})`);

	}

	private moveMediaSlider() {
		let svgBox = document.getElementById('TimelineMediaBar')!;

		let svg = d3.select(svgBox);

		const rect = svg.select('rect');
		rect.attr('transform', `translate(${this.mediaSliderScale(this.currentDate.diff(this.minDate, 'days'))})`);
	}
}
