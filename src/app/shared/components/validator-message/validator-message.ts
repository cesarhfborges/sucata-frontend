import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CustomValidator } from '@/shared/components/custom-validator';
import { animate, style, transition, trigger } from '@angular/animations';
import { listaUF } from '@/core/enums/uf';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-validator-message',
  imports: [MessageModule],
  template: `
    @if (errorMessage) {
      <p-message [@fade] severity="error" size="small" variant="simple">{{ errorMessage }}</p-message>
    }
  `,
  animations: [
    trigger('fade', [
      transition(':enter', [style({ opacity: 0, transform: 'translateY(-5px)' }), animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-5px)' }))])
    ])
  ]
})
export class ValidatorMessage {
  @Input() control: AbstractControl | null | any = null;

  get errorMessage(): string | null {
    if (this.control && this.control.errors && (this.control.touched || this.control.dirty)) {
      const firstErrorKey = Object.keys(this.control.errors)[0];
      return CustomValidator.getValidatorErrorMessage(firstErrorKey, this.control.errors[firstErrorKey]);
    }
    return null;
  }

  static UF(control: AbstractControl): any {
    const ufs = listaUF.map((i) => i.value);
    if (control.value === '' || control.value === null) {
      return null;
    }
    if (control.touched && !ufs.includes(control.value)) {
      return { invalidUfField: true };
    }
    return null;
  }
}
