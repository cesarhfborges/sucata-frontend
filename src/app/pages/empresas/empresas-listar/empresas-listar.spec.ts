import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasListar } from './empresas-listar';

describe('EmpresasListar', () => {
  let component: EmpresasListar;
  let fixture: ComponentFixture<EmpresasListar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresasListar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresasListar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
