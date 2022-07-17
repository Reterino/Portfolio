import { TestBed } from '@angular/core/testing';

import { CovidTimeDataService } from './covid-time-data.service';

describe('CovidTimeDataService', () => {
  let service: CovidTimeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidTimeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
