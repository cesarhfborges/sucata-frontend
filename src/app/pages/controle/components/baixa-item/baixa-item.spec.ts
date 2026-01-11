import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaixaItem } from './baixa-item';

describe('BaixaItem', () => {
  let component: BaixaItem;
  let fixture: ComponentFixture<BaixaItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaixaItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaixaItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
