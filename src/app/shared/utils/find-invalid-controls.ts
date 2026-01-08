import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export interface InvalidControl {
  path: string;
  errors: string[];
}

export function findInvalidControls(input: AbstractControl, path: string = ''): InvalidControl[] {
  let invalidControls: InvalidControl[] = [];

  if (input instanceof FormGroup) {
    Object.keys(input.controls).forEach((key) => {
      const control = input.get(key)!;
      const currentPath = path ? `${path}.${key}` : key;
      invalidControls.push(...findInvalidControls(control, currentPath));
    });
  } else if (input instanceof FormArray) {
    input.controls.forEach((control, index) => {
      const currentPath = path ? `${path}[${index}]` : `[${index}]`;
      invalidControls.push(...findInvalidControls(control, currentPath));
    });
  } else if (input.invalid && input.errors) {
    invalidControls.push({
      path: path,
      errors: Object.keys(input.errors)
    });
  }

  return invalidControls;
}
