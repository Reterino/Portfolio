import { ElementRef, Injectable } from '@angular/core';
import { BasemapType }            from '../covid-dashboard.component';
import WebMap                     from '@arcgis/core/WebMap';
import MapView                    from '@arcgis/core/views/MapView';
import ScaleBar                   from '@arcgis/core/widgets/ScaleBar';
import Home                       from '@arcgis/core/widgets/Home';
import FeatureLayer               from '@arcgis/core/layers/FeatureLayer';
import PopupTemplate              from '@arcgis/core/PopupTemplate';




@Injectable({
	            providedIn: 'root'
            })
export class ArcgisMapCreationService {

	mapView!: MapView;

	constructor() { }

	createMap(mapNode: ElementRef, zoom: number, center: number[], basemap: BasemapType) {
		return new Promise((resolve, reject) => {
			const map = new WebMap({basemap});

			this.mapView = new MapView({
				                           container: mapNode.nativeElement,
				                           center,
				                           zoom,
				                           map
			                           });

			this.mapView.when(async () => {
				this.mapView.ui.add(new ScaleBar({
					                                 view : this.mapView,
					                                 unit : 'metric',
					                                 style: 'ruler'
				                                 }), 'top-right');
				this.mapView.ui.add(new Home({
					                             view: this.mapView
				                             }), 'top-left');

				await this.initStateLayer();

				resolve({
					        map: this.mapView
				        });
			}, (err: any) => {
				console.error(err);
				reject(err);
			});
		});
	}

	private async initStateLayer() {
		let featureLayer = new FeatureLayer({
			                                    url   : 'https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/STE/MapServer/0',
			                                    id    : 'State Layer',
			                                    fields: [ '*' ]
		                                    });
		featureLayer.load()
		            .then(next => {
			            let fields = next.fields;
			            let content = '';
			            fields.forEach((d: any) => {
				            content += `${d.name.slice(0, 1)
				                           .toUpperCase() + d.name.slice(1)}: {${d.name}}</br>`;
			            });
			            featureLayer.popupTemplate = new PopupTemplate({
				                                                           title: '',
				                                                           content
			                                                           });
			            this.mapView.map.add(next);
		            });
	}
}
