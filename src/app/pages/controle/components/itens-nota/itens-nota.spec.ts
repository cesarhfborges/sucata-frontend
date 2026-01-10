import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItensNota } from './itens-nota';

describe('ItensNota', () => {
  let component: ItensNota;
  let fixture: ComponentFixture<ItensNota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItensNota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItensNota);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
