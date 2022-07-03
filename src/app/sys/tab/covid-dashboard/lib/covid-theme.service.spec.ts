import { TestBed } from '@angular/core/testing';

import { CovidThemeService } from './covid-theme.service';

describe('CovidThemeService', () => {
  let service: CovidThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
