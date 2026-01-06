import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasEditar } from './empresas-editar';

describe('EmpresasEditar', () => {
  let component: EmpresasEditar;
  let fixture: ComponentFixture<EmpresasEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresasEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresasEditar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
