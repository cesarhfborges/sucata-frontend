import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Controle } from './controle';

describe('Controle', () => {
  let component: Controle;
  let fixture: ComponentFixture<Controle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Controle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Controle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
