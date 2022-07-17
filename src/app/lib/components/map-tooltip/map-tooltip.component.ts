import { Component, OnInit } from '@angular/core';
import { MapTooltipService } from '../../../sys/covid-dashboard/lib/map-tooltip.service';




@Component({
	           selector   : 'app-map-tooltip',
	           templateUrl: './map-tooltip.component.html',
	           styleUrls  : [ './map-tooltip.component.scss' ]
           })
export class MapTooltipComponent implements OnInit {

	constructor(
			public mapTooltipSvc: MapTooltipService
	) { }

	ngOnInit(): void {

	}

}
