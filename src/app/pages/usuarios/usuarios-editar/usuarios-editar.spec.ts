import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosEditar } from './usuarios-editar';

describe('UsuariosEditar', () => {
  let component: UsuariosEditar;
  let fixture: ComponentFixture<UsuariosEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosEditar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosEditar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
