import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appOnClickClear]',
  standalone: true
})
export class OnClickClear {
  @Input() appOnClickClear: any;
  @Input() setValueTo: any = undefined;
  @Output() appOnClickClearChange = new EventEmitter<any>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (this.isIgnored(target)) {
      return;
    }

    this.appOnClickClearChange.emit(this.setValueTo);
  }

  private isIgnored(element: HTMLElement | null): boolean {
    while (element) {
      if (element.hasAttribute('appOnClickIgnore')) {
        return true;
      }
      element = element.parentElement;
    }
    return false;
  }
}
