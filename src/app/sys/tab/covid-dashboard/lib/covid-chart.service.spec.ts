import { TestBed } from '@angular/core/testing';

import { CovidChartService } from './covid-chart.service';

describe('CovidChartService', () => {
  let service: CovidChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
