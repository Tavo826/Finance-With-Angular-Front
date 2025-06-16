import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOriginComponent } from './edit-origin.component';

describe('EditOriginComponent', () => {
  let component: EditOriginComponent;
  let fixture: ComponentFixture<EditOriginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOriginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOriginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
