import { ChartDataset, ChartType } from 'chart.js/auto';
import { ChartOptions }            from 'chart.js';




const ragcolors = [
	'rag0',
	'rag1',
	'rag2',
	'rag3',
	'rag4'
] as const;
export type RAGColorType = typeof ragcolors[number]

export interface ChartWrapperIntf {
	title: string;
	descr: string;
	type: ChartType;
	dataset: ChartDataset[];
	labels: any[];
	options: ChartOptions;
}

export class ChartWrapper implements ChartWrapperIntf {
	public title: string;
	public descr: string;
	public type: ChartType;
	public dataset: ChartDataset[];
	public labels: any[];
	public options: ChartOptions;

	constructor(options: ChartOptions,
	            title: string           = 'Loading...',
	            descr: string           = 'Loading...',
	            type: ChartType         = 'bar',
	            dataset: ChartDataset[] = [],
	            labels: any[]           = []) {
		this.title = title;
		this.descr = descr;
		this.type = type;
		this.dataset = dataset;
		this.labels = labels;
		this.options = options;
	}
}

const tailwindColors = [
	'slate',
	'gray',
	'zinc',
	'neutral',
	'stone',
	'red',
	'orange',
	'amber',
	'yellow',
	'lime',
	'green',
	'emerald',
	'teal',
	'cyan',
	'sky',
	'blue',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'pink',
	'rose',
] as const;
export type TailwindColorType = typeof tailwindColors[number];

const tailwindTint = [
	'50',
	'100',
	'200',
	'300',
	'400',
	'500',
	'600',
	'700',
	'800',
	'900'
] as const;
export type TailwindTintType = typeof tailwindTint[number];