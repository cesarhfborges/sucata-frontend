import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioEmpresas } from './relatorio-empresas';

describe('RelatorioEmpresas', () => {
  let component: RelatorioEmpresas;
  let fixture: ComponentFixture<RelatorioEmpresas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioEmpresas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioEmpresas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
