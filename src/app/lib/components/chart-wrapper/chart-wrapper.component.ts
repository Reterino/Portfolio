import { Component, Input, OnInit } from '@angular/core';
import { ChartDataset, ChartType }  from 'chart.js/auto';
import { ChartOptions }             from 'chart.js';

@Component({
  selector: 'app-chart-wrapper',
  templateUrl: './chart-wrapper.component.html',
  styleUrls: ['./chart-wrapper.component.scss']
})
export class ChartWrapperComponent implements OnInit {
	@Input() title: string = 'Loading...';
	@Input() descr: string = 'Loading...';

	@Input() type: ChartType = 'bar';
	@Input() datasets: ChartDataset<any, any>[] = [];
	@Input() labels: any[] = [];
	@Input() options: ChartOptions = {};

  constructor() { }

  ngOnInit(): void {
  }

}
