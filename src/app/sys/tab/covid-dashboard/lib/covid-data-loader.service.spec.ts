import { TestBed } from '@angular/core/testing';

import { CovidDataLoaderService } from './covid-data-loader.service';

describe('CovidDataLoaderService', () => {
  let service: CovidDataLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidDataLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
