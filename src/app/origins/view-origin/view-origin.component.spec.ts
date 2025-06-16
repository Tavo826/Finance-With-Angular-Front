import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOriginComponent } from './view-origin.component';

describe('ViewOriginComponent', () => {
  let component: ViewOriginComponent;
  let fixture: ComponentFixture<ViewOriginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOriginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOriginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
