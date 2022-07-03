import { NgModule }              from '@angular/core';
import { CommonModule }          from '@angular/common';
import { KpiTickerComponent }    from './components/kpi-ticker/kpi-ticker.component';
import { ChartWrapperComponent } from './components/chart-wrapper/chart-wrapper.component';
import { ChartComponent }        from './components/chart/chart.component';
import { MatTooltipModule }      from '@angular/material/tooltip';



@NgModule({
  declarations: [
	  KpiTickerComponent,
	  ChartWrapperComponent,
	  ChartComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule
  ],
	exports: [
		KpiTickerComponent,
		ChartWrapperComponent,
		ChartComponent
	]
})
export class LibModule { }
