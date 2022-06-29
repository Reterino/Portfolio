import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import MapView                                                     from '@arcgis/core/views/MapView';
import { ArcgisMapCreationService }                                from './lib/arcgis-map-creation.service';




const basemaps = [
	'satellite',
	'hybrid',
	'terrain',
	'ocean', 'osm',
	'dark-gray-vector',
	'gray-vector',
	'streets-vector',
	'topo-vector',
	'streets-night-vector',
	'streets-relief-vector',
	'streets-navigation-vector'
] as const;
export type BasemapType = typeof basemaps[number]

@Component({
	           selector   : 'app-covid-dashboard',
	           templateUrl: './covid-dashboard.component.html',
	           styleUrls  : [ './covid-dashboard.component.scss' ]
           })
export class CovidDashboardComponent implements OnInit, AfterViewInit {
	public title = '<span class="font-bold pr-2">Covid Dashboard</span> Timeline 2020-2022'
	public date = new Date();

	@ViewChild('MapNode', {static: true}) public mapNode!: ElementRef;
	public zoom: number = 4.5;
	public center: number[] = [ 133.25, -24.25 ];
	public basemap: BasemapType = 'dark-gray-vector';
	private mapView!: MapView;

	constructor(
			private arcgisMapSvc: ArcgisMapCreationService
	) {
		setInterval(() => this.date = new Date(),250);
	}

	ngOnInit(): void {
	}

	ngAfterViewInit() {
		this.arcgisMapSvc.createMap(this.mapNode, this.zoom, this.center,this.basemap).then((next:any) => {
			this.mapView = next.map;
		});
	}
}
