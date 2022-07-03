import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiTickerComponent } from './kpi-ticker.component';

describe('KpiTickerComponent', () => {
  let component: KpiTickerComponent;
  let fixture: ComponentFixture<KpiTickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiTickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
