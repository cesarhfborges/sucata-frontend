import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaisListar } from './materiais-listar';

describe('MateriaisListar', () => {
  let component: MateriaisListar;
  let fixture: ComponentFixture<MateriaisListar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriaisListar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MateriaisListar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
