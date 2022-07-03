import { Component, Input, OnInit } from '@angular/core';
import { RAGColorType }             from '../../types/lib-types';

@Component({
  selector: 'app-kpi-ticker',
  templateUrl: './kpi-ticker.component.html',
  styleUrls: ['./kpi-ticker.component.scss']
})
export class KpiTickerComponent implements OnInit {
	@Input() label: string = '';
	@Input() value: number | string = 0;
	@Input() arrow: 'up' | 'neutral' | 'down' = 'neutral';
	@Input() color: RAGColorType = 'rag0';
	@Input() edges: boolean = true;
	@Input() arrowTooltip: string = '';

	arrowIcon: string = 'fa-arrow-down';

  constructor() { }

  ngOnInit(): void {
  }

	ngOnChanges() {
		if (this.arrow === 'up') {
			this.arrowIcon = 'fa-arrow-up';
		}
		if (this.arrow === 'down') {
			this.arrowIcon = 'fa-arrow-down';
		}
		if (this.arrow === 'neutral') {
			this.arrowIcon = 'fa-grip-lines';
		}
	}
}
