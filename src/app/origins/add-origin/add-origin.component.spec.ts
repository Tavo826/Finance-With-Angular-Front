import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOriginComponent } from './add-origin.component';

describe('AddOriginComponent', () => {
  let component: AddOriginComponent;
  let fixture: ComponentFixture<AddOriginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOriginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOriginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
