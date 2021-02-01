import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordsLyricsComponent } from './chords-lyrics.component';

describe('ChordsLyricsComponent', () => {
  let component: ChordsLyricsComponent;
  let fixture: ComponentFixture<ChordsLyricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChordsLyricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChordsLyricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
