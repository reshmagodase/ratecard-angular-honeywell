import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCardDashboardComponent } from './rate-card-dashboard.component';

describe('RateCardDashboardComponent', () => {
  let component: RateCardDashboardComponent;
  let fixture: ComponentFixture<RateCardDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateCardDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateCardDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
