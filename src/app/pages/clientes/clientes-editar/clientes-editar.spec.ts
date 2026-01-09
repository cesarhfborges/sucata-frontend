import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesEditar } from './clientes-editar';

describe('ClientesEditar', () => {
  let component: ClientesEditar;
  let fixture: ComponentFixture<ClientesEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesEditar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
