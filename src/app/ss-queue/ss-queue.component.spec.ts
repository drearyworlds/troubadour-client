import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsQueueComponent } from './ss-queue.component';

describe('SsQueueComponent', () => {
  let component: SsQueueComponent;
  let fixture: ComponentFixture<SsQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsQueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SsQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
