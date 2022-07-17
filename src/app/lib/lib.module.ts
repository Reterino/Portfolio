import { NgModule }              from '@angular/core';
import { CommonModule }          from '@angular/common';
import { ChartWrapperComponent } from './components/chart-wrapper/chart-wrapper.component';
import { ChartComponent }        from './components/chart/chart.component';
import { MatTooltipModule }      from '@angular/material/tooltip';
import { MapTooltipComponent }   from './components/map-tooltip/map-tooltip.component';
import { MatIconModule }         from '@angular/material/icon';
import { MatButtonModule }       from '@angular/material/button';
import { MapTooltipInfoLineComponent } from './components/map-tooltip-info-line/map-tooltip-info-line.component';



@NgModule({
  declarations: [
	  ChartWrapperComponent,
	  ChartComponent,
   MapTooltipComponent,
   MapTooltipInfoLineComponent
  ],
	          imports: [
		          CommonModule,
		          MatTooltipModule,
		          MatIconModule,
		          MatButtonModule
	          ],
	          exports: [
		          ChartWrapperComponent,
		          ChartComponent,
		          MapTooltipComponent
	          ]
          })
export class LibModule { }
