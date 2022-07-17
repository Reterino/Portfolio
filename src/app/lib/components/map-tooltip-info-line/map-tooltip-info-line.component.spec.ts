import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTooltipInfoLineComponent } from './map-tooltip-info-line.component';

describe('MapTooltipInfoLineComponent', () => {
  let component: MapTooltipInfoLineComponent;
  let fixture: ComponentFixture<MapTooltipInfoLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapTooltipInfoLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapTooltipInfoLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
