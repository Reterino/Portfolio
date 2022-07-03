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

export interface LGAInfoIntf {
	lga_name19: string;
	lga_code19: string;
	population: string;
}

export interface CovidByAgeDailyIntf {
	'notification_date': string,
	'AgeGroup_0-19': string,
	'AgeGroup_20-24': string,
	'AgeGroup_25-29': string,
	'AgeGroup_30-34': string,
	'AgeGroup_35-39': string,
	'AgeGroup_40-44': string,
	'AgeGroup_45-49': string,
	'AgeGroup_50-54': string,
	'AgeGroup_55-59': string,
	'AgeGroup_60-64': string,
	'AgeGroup_65-69': string,
	'AgeGroup_70+': string,
	'AgeGroup_None': string,
}

export interface CovidByLocationDailyIntf {
	'notification_date': string,
	'postcode': string,
	'lhd_2010_code': string,
	'lhd_2010_name': string,
	'lga_code19': string,
	'lga_name19': string,
	'confirmed_by_pcr': string,
	'confirmed_cases_count': string,
}

export interface LGATotalsIntf {
	lga_code19: string,
	lga_name19: string,
	cases: number
}

export interface CovidTotalsDataIntf {
	lgaTotals: LGATotalsIntf[]
	'AgeGroup_0-19': number,
	'AgeGroup_20-24': number,
	'AgeGroup_25-29': number,
	'AgeGroup_30-34': number,
	'AgeGroup_35-39': number,
	'AgeGroup_40-44': number,
	'AgeGroup_45-49': number,
	'AgeGroup_50-54': number,
	'AgeGroup_55-59': number,
	'AgeGroup_60-64': number,
	'AgeGroup_65-69': number,
	'AgeGroup_70+': number,
	'AgeGroup_None': number,
	totalCases: number
}