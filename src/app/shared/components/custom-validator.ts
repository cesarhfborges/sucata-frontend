import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { catchError, first, map, Observable, of, switchMap, timer } from 'rxjs';
import { UsuariosService } from '@/core/services/usuarios-service';

@Injectable({
  providedIn: 'root'
})
export class CustomValidator {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any): string {
    const config: any = {
      required: 'Campo Obrigatório.',
      min: `O mínimo para o campo é ${validatorValue?.min ?? '0'}.`,
      max: `O máximo para o campo é ${validatorValue?.max ?? '0'}`,
      minlength: `Tamanho mínimo ${validatorValue?.requiredLength ?? '0'} caracteres.`,
      maxlength: `O Tamanho máximo para o campo é ${validatorValue?.requiredLength ?? '0'} caracteres.`,
      email: 'Endereço de email inválido.',
      invalidCnpjField: 'CNPJ informado é inválido.',
      invalidCepField: 'O CEP informado é inválido.',
      invalidUfField: 'A UF informada é inválida.',
      passwordMismatch: 'A confirmação de senha deve ser igual à senha digitada.',
      emailCheckFailed: 'Não foi possível verificar a consistência do email informado.',
      emailTaken: 'O Email informado já esta em uso.'
    };

    return config[validatorName];
  }

  static checkEmailAvailability(service: UsuariosService, getId: () => number | undefined): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      const id = getId();

      return timer(900).pipe(
        switchMap(() => service.checkEmailAvailability(control.value, id)),
        map((isAvailable) => (isAvailable ? null : { emailTaken: true })),
        catchError(() => of({ emailCheckFailed: true })),
        first()
      );
    };
  }

  static passwordMatchValidator(origin: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(origin);
      const confirmPassword = control.get(target);

      if (!password || !confirmPassword) {
        return null;
      }

      if (confirmPassword.errors && !confirmPassword.errors['mismatch']) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { mismatch: true };
      } else {
        confirmPassword.setErrors(null);
        return null;
      }
    };
  }
}
