import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import MapView                                                     from '@arcgis/core/views/MapView';
import { ArcgisMapCreationService }                                from './lib/arcgis-map-creation.service';
import type { BasemapType }                                        from './lib/covid-types';
import { CovidDataLoaderService }                                  from './lib/covid-data-loader.service';




export type { BasemapType } from './lib/covid-types';

@Component({
	           selector   : 'app-covid-dashboard',
	           templateUrl: './covid-dashboard.component.html',
	           styleUrls  : [ './covid-dashboard.component.scss' ]
           })
export class CovidDashboardComponent implements OnInit, AfterViewInit {
	public title = '<span class="font-bold pr-2">Covid Dashboard</span> Timeline 2020-2022';
	public date = new Date();

	@ViewChild('MapNode', {static: true}) public mapNode!: ElementRef;
	public zoom: number = 5;
	public center: number[] = [ 147.02, -32.15 ];
	public basemap: BasemapType = 'dark-gray-vector';
	private mapView!: MapView;

	constructor(
			private arcgisMapSvc: ArcgisMapCreationService,
			private covidDataLdSvc: CovidDataLoaderService
	) {
		setInterval(() => this.date = new Date(), 250);
	}

	ngOnInit(): void {
	}

	ngAfterViewInit() {
		this.arcgisMapSvc.createMap(this.mapNode, this.zoom, this.center, this.basemap)
		    .then((next: any) => {
			    this.mapView = next.map;
		    });
	}
}
