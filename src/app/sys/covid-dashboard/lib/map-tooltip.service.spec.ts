import { TestBed } from '@angular/core/testing';

import { MapTooltipService } from './map-tooltip.service';

describe('MapTooltipService', () => {
  let service: MapTooltipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapTooltipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
