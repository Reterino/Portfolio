import { ElementRef, Injectable }          from '@angular/core';
import { BasemapType, CovidLGATotalsIntf } from './covid-types';
import WebMap                              from '@arcgis/core/WebMap';
import MapView                             from '@arcgis/core/views/MapView';
import ScaleBar                            from '@arcgis/core/widgets/ScaleBar';
import Home                                from '@arcgis/core/widgets/Home';
import FeatureLayer                        from '@arcgis/core/layers/FeatureLayer';
import { CovidDataLoaderService } from './covid-data-loader.service';
import SimpleFillSymbol           from '@arcgis/core/symbols/SimpleFillSymbol';
import Color                      from '@arcgis/core/Color';
import SimpleRenderer             from '@arcgis/core/renderers/SimpleRenderer';
import UniqueValueRenderer        from '@arcgis/core/renderers/UniqueValueRenderer';
import * as tinycolor             from 'tinycolor2';
import * as d3                    from 'd3';
import { BehaviorSubject }        from 'rxjs';
import Graphic                    from '@arcgis/core/Graphic';
import Zoom                       from '@arcgis/core/widgets/Zoom';
import { CovidTimeDataService }   from './covid-time-data.service';
import { delay }                  from '../../../lib/utils/global-functions';




@Injectable({
	            providedIn: 'root'
            })
export class ArcgisMapCreationService {

	mapView!: MapView;

	clickedLGA: BehaviorSubject<string> = new BehaviorSubject<string>('');

	colorFn = d3.interpolatePurples;

	constructor(
			private covidDataLdSvc: CovidDataLoaderService,
			private covidTimeDataSvc: CovidTimeDataService
	) {
		this.covidTimeDataSvc.currentDateData.subscribe(next => {
			if (next.length > 0) {
				this.buildNextColors(next);
			}
		});
	}

	createMap(mapNode: ElementRef, zoom: number, center: number[], basemap: BasemapType) {
		return new Promise((resolve, reject) => {
			const map = new WebMap({basemap});

			this.mapView = new MapView({
				                           container: mapNode.nativeElement,
				                           center,
				                           zoom,
				                           map,
				                           ui       : {
					                           components: [ 'attribution' ]
				                           }
			                           });

			this.mapView.when(async () => {
				this.mapView.ui.add(new ScaleBar({
					                                 view : this.mapView,
					                                 unit : 'metric',
					                                 style: 'ruler'
				                                 }), 'top-right');
				this.mapView.ui.add(new Zoom({
					                             view: this.mapView
				                             }), 'bottom-right');

				this.mapView.ui.add(new Home({
					                             view: this.mapView
				                             }), 'bottom-right');

				await this.initNSWLGALayer();

				this.mapView.on('click', (e) => {
					this.mapView.hitTest(e)
					    .then(response => {
						    response.results.forEach(result => {
							    if (result.layer.id.includes('NSWLayer') && 'graphic' in result) {
								    this.clickedLGA.next(result.graphic.attributes.lganame);
								    this.highlight(result.graphic);
							    }
						    });
					    });
				});

				resolve({
					        map: this.mapView
				        });
			}, (err: any) => {
				console.error(err);
				reject(err);
			});
		});
	}

	formatNumber(num: number) {
		if (num > 5000) {
			return (num / 1000).toFixed(1) + 'k';
		}
		if (num > 99999) {
			return (num / 1000).toFixed(0) + 'k';
		}
		return num.toString();
	}

	public async resetHighlight() {
		let stateLayer = this.mapView.map.layers.find(d => d.id === 'NSWLayer') as FeatureLayer;
		stateLayer.renderer = await this.buildRenderer();
	}

	private scaleMax(num: number): number {
		if (num <= 5) {
			return 10;
		}
		if (num <= 25) {
			return 50;
		}
		if (num <= 70) {
			return 100;
		}
		if (num <= 300) {
			return 500;
		}
		if (num <= 600) {
			return 1000;
		}
		if (num <= 5000) {
			return 10000;
		}
		return Math.ceil(num / 10000) * 10000;
	}

	private async colorData() {
		if (this.covidDataLdSvc.covidTotals.totalCases > 0) {
			let stateLayer = this.mapView.map.layers.find(d => d.id === 'NSWLayer') as FeatureLayer;
			stateLayer.renderer = await this.buildRenderer();
		} else {
			setTimeout(() => this.colorData(), 100);
		}
	}

	private async initNSWLGALayer() {
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
			            this.mapView.map.add(next);
			            this.colorData();
		            });
	}

	private async buildRenderer(data?: CovidLGATotalsIntf[]) {
		let renderer = new UniqueValueRenderer();
		let max = 1;
		if (!data) {
			while (!this.covidDataLdSvc.covidTotals.lgaTotals) {
				await delay(50);
			}
			data = this.covidDataLdSvc.covidTotals.lgaTotals;
		}
		data.forEach((d) => {
			if (d.cases > max) {
				max = d.cases;
			}
		});
		max = this.scaleMax(max);

		let scale = d3.scaleLinear()
		              .domain([ 1, max ])
		              .range([ 0.5, 1 ]);

		data.forEach((d) => {
			let color = this.colorFn(d.cases ? scale(d.cases) : 0.25);
			let fillColor = tinycolor(color)
					.toHex();
			let symbol = new SimpleFillSymbol();
			symbol.color = new Color('#' + fillColor);
			symbol.color.a = 0.75;
			symbol.outline.color = new Color('#222222');
			symbol.outline.color.a = 0.75;
			symbol.outline.cap = 'square';
			symbol.outline.join = 'round';
			symbol.outline.width = 0.5;
			renderer.addUniqueValueInfo(d.lga_name19, symbol);
		});
		renderer.field = 'lganame';
		let symbol = new SimpleFillSymbol();
		symbol.color = new Color('#afafaf');
		symbol.color.a = 0.5;
		symbol.style = 'forward-diagonal';
		symbol.outline.color = new Color('#222222');
		symbol.outline.color.a = 0.75;
		renderer.defaultSymbol = symbol;
		this.buildColorScale([ 1, max ]);
		return renderer;
	}

	private async buildNextColors(next: CovidLGATotalsIntf[]) {
		if (this.mapView) {
			let stateLayer = this.mapView.map.layers.find(d => d.id === 'NSWLayer') as FeatureLayer;
			if (stateLayer) {
				stateLayer.renderer = await this.buildRenderer(next);
			} else {
				setTimeout(() => this.buildNextColors(next), 100);
			}
		} else {
			setTimeout(() => this.buildNextColors(next), 100);
		}
	}

	private async highlight(graphic: Graphic) {
		let stateLayer = this.mapView.map.layers.find(d => d.id === 'NSWLayer') as FeatureLayer;
		let renderer = await this.buildRenderer();
		renderer.getUniqueValueInfo(graphic)
		        .then(next => {
			        let value = next.value;
			        let symbol = (next.symbol as SimpleFillSymbol).clone();
			        symbol.outline.color = new Color('#0f7f7f');
			        symbol.outline.color.a = 1;
			        symbol.outline.width = 4;
			        renderer.removeUniqueValueInfo(value);
			        renderer.addUniqueValueInfo(value, symbol);
			        stateLayer.renderer = renderer;
		        });
	}

	private buildColorScale(scale: [ number, number ]) {
		let min = scale[0];
		let max = scale[1];

		let svgBox = document.getElementById('MapColorScale');

		let svg = d3.select(svgBox);
		svg.selectAll('*')
		   .remove();
		svg.append('g');

		let initialColor = this.colorFn(0.4);
		let middleColor = this.colorFn(0.75);
		let finalColor = this.colorFn(1);

		let legendItemWidth = 4;
		let legendItemHeight = 15;
		let rectPadding = 10;
		let leftPadding = 20;

		let yStart = 110;
		let titleTextPadding = 8;

		let startTextSize = this.formatNumber(min).length * 8;
		let endTextSize = this.formatNumber(max).length * 8;

		const legendItemG = svg.append('rect')
		                       .attr('x', leftPadding + startTextSize)
		                       .attr('y', yStart)
		                       .attr('width', legendItemWidth * 20)
		                       .attr('height', legendItemHeight)
		                       .attr('fill-opacity', 0.75)
		                       .attr('stroke-width', 1);

		const startTextG = svg.append('text')
		                      .attr('x', leftPadding + startTextSize - rectPadding)
		                      .attr('y', yStart + (legendItemHeight / 2))
		                      .attr('text-anchor', 'end')
		                      .attr('font-size', 10)
		                      .attr('class', 'font-mono font-light fill-current text-neutral-200')
		                      .attr('dominant-baseline', 'middle')
		                      .text(this.formatNumber(min));

		const endTextG = svg.append('text')
		                    .attr('x', leftPadding + startTextSize + rectPadding + (legendItemWidth * 20))
		                    .attr('y', yStart + (legendItemHeight / 2))
		                    .attr('text-anchor', 'start')
		                    .attr('font-size', 10)
		                    .attr('class', 'font-mono font-light fill-current text-neutral-200')
		                    .attr('dominant-baseline', 'middle')
		                    .text(this.formatNumber(max));

		const titleTextG = svg.append('text')
		                      .attr('x', (endTextSize + startTextSize + (legendItemWidth * 20)) / 2)
		                      .attr('y', yStart - titleTextPadding)
		                      .attr('text-anchor', 'middle')
		                      .attr('font-size', 10)
		                      .attr('class', 'font-mono font-light fill-current text-neutral-200')
		                      .attr('dominant-baseline', 'middle')
		                      .text('Covid Cases');

		let gradient = svg.append('defs')
		                  .append('linearGradient')
		                  .attr('id', 'gradient')
		                  .attr('x1', '0%')
		                  .attr('x2', '100%')
		                  .attr('y1', '0%')
		                  .attr('y2', '0%');
		gradient.append('stop')
		        .attr('class', 'start')
		        .attr('offset', '0%')
		        .attr('stop-color', initialColor)
		        .attr('stop-opacity', 1);
		gradient.append('stop')
		        .attr('class', 'start')
		        .attr('offset', '50%')
		        .attr('stop-color', middleColor)
		        .attr('stop-opacity', 1);
		gradient.append('stop')
		        .attr('class', 'start')
		        .attr('offset', '100%')
		        .attr('stop-color', finalColor)
		        .attr('stop-opacity', 1);

		legendItemG.attr('fill', 'url(#gradient)')
		           .attr('stroke', finalColor);
	}
}
