import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import Chart, { ChartDataset, ChartType, DefaultDataPoint }                                         from 'chart.js/auto';
import { ChartOptions }                                                                             from 'chart.js';




@Component({
	           selector   : 'app-chart',
	           templateUrl: './chart.component.html',
	           styleUrls  : [ './chart.component.scss' ]
           })
export class ChartComponent implements OnInit, OnChanges, AfterViewInit {
	@ViewChild('Chart') chartElement!: ElementRef;

	@Input() type: ChartType = 'bar';
	@Input() datasets: ChartDataset<any, any>[] = [];
	@Input() labels: any[] = [];
	@Input() options: ChartOptions = {};

	public chartObj!: Chart<ChartType, DefaultDataPoint<ChartType>, string>;
	private ctx!: CanvasRenderingContext2D;

	constructor() { }

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges) {
		if (this.chartObj) {
			if (changes['labels']) {
				this.chartObj.data.labels = this.labels;
			}
			if (changes['datasets']) {
				this.chartObj.data.datasets = this.datasets;
			}
			if (changes['options']) {
				this.chartObj.options = this.options;
			}
			this.chartObj.update();
		}
	}

	ngAfterViewInit() {
		this.buildChart();
	}

	buildChart() {
		if (this.chartElement && !this.chartObj) {
			this.ctx = this.chartElement.nativeElement.getContext('2d') as CanvasRenderingContext2D;
			this.chartObj = new Chart(
					this.ctx,
					{
						type   : this.type,
						data   : {
							labels  : this.labels,
							datasets: this.datasets
						},
						options: this.options
					}
			);
		}
	}
}
