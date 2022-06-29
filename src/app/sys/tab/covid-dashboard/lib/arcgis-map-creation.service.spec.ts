import { TestBed } from '@angular/core/testing';

import { ArcgisMapCreationService } from './arcgis-map-creation.service';

describe('ArcgisMapCreationService', () => {
  let service: ArcgisMapCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArcgisMapCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
