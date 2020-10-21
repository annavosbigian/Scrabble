import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLettersComponent } from './player-letters.component';

describe('PlayerLettersComponent', () => {
  let component: PlayerLettersComponent;
  let fixture: ComponentFixture<PlayerLettersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerLettersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
