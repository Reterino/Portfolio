import { ElementRef, Injectable } from '@angular/core';
import { BasemapType }            from './covid-types';
import WebMap                     from '@arcgis/core/WebMap';
import MapView                    from '@arcgis/core/views/MapView';
import ScaleBar                   from '@arcgis/core/widgets/ScaleBar';
import Home                       from '@arcgis/core/widgets/Home';
import FeatureLayer               from '@arcgis/core/layers/FeatureLayer';
import { CovidDataLoaderService } from './covid-data-loader.service';
import SimpleFillSymbol           from '@arcgis/core/symbols/SimpleFillSymbol';
import Color                      from '@arcgis/core/Color';
import SimpleRenderer             from '@arcgis/core/renderers/SimpleRenderer';
import UniqueValueRenderer        from '@arcgis/core/renderers/UniqueValueRenderer';
import * as tinycolor             from 'tinycolor2';
import * as d3                    from 'd3';
import PopupTemplate              from '@arcgis/core/PopupTemplate';





@Injectable({
	            providedIn: 'root'
            })
export class ArcgisMapCreationService {

	mapView!: MapView;

	constructor(
			private covidDataLdSvc: CovidDataLoaderService
	) { }

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

	colorData() {
		if (this.covidDataLdSvc.covidTotals.totalCases > 0) {
			let stateLayer = this.mapView.map.layers.find(d => d.id === 'NSWLayer') as FeatureLayer;
			let renderer = new UniqueValueRenderer();
			renderer.field = 'lganame';
			this.buildRenderer(renderer);
			stateLayer.renderer = renderer;
		} else {
			setTimeout(() => this.colorData(), 250);
		}
	}

	private async initStateLayer() {
		let renderer = new SimpleRenderer();
		let featureLayer = new FeatureLayer({
			                                    url          : 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Administrative_Boundaries/MapServer/1',
			                                    id           : 'NSWLayer',
			                                    fields       : [ '*' ],
			                                    labelsVisible: false,
			                                    popupEnabled : false,
			                                    renderer
		                                    });
		featureLayer.load()
		            .then((next: FeatureLayer) => {
									// let fields = next.fields;
									// let content = '';
									// fields.forEach(d => {
									// 	content += `${d.name}: {${d.name}} </br>`
									// })
			            // next.popupTemplate = new PopupTemplate({content});
			            this.mapView.map.add(next);
			            this.colorData();
		            });
	}

	private buildRenderer(renderer: UniqueValueRenderer) {
		let min = 1;
		let max = 0;
		this.covidDataLdSvc.covidTotals.lgaTotals.forEach((d) => {
			if (d.cases < min) {
				min = d.cases;
			}
			if (d.cases > max) {
				max = d.cases;
			}
		});

		let scale = d3.scaleLinear()
		              .domain([ min, max ])
		              .range([ 0, 1 ]);

		this.covidDataLdSvc.covidTotals.lgaTotals.forEach((d) => {
			let color = d3.interpolatePurples(scale(d.cases));
			let fillColor = tinycolor(color)
					.toHex();
			let borderColor = tinycolor(color)
					.darken(20)
					.toHex();
			let symbol = new SimpleFillSymbol();
			symbol.color = new Color('#' + fillColor);
			symbol.color.a = 0.5;
			symbol.outline.color = new Color('#' + borderColor);
			renderer.addUniqueValueInfo(d.lga_name19, symbol);
		});
		let symbol = new SimpleFillSymbol();
		symbol.color.a = 0;
		symbol.outline.color = new Color('#000000');
		symbol.outline.width = 1;
		renderer.defaultSymbol = symbol;
	}
}
