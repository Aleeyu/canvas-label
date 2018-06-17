import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildbComponent } from './childb.component';

describe('ChildbComponent', () => {
  let component: ChildbComponent;
  let fixture: ComponentFixture<ChildbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
