import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { JsonPipe } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-relatorios',
  imports: [ReactiveFormsModule, CardModule, InputNumberModule, ChipModule, SelectModule, DatePickerModule, ButtonModule, PanelModule, JsonPipe, MultiSelectModule],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.scss'
})
export class Relatorios {
  loading = false;

  form: FormGroup;

  pdfUrl: SafeResourceUrl | null = null;

  private readonly _fb = inject(FormBuilder);
  private readonly _http = inject(HttpClient);
  private readonly _sanitizer = inject(DomSanitizer);

  constructor() {
    this.form = this._fb.group({
      cliente_id: new FormControl(368, [Validators.required]),
      empresas: new FormControl([1, 2, 3, 4, 5, 6], []),
      status: new FormControl('TODAS', [Validators.required]),
      datas: this._fb.group({
        inicio: new FormControl('2024-01-01', [Validators.required]),
        fim: new FormControl('2026-01-12', [Validators.required])
      })
    });
  }

  gerarRelatorio(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.pdfUrl = null;

    this._http.post('http://localhost:8000/api/relatorios/por-cliente', this.form.value, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.pdfUrl = this._sanitizer.bypassSecurityTrustResourceUrl(`${url}#toolbar=1&navpanes=0&scrollbar=0&zoom=page-width`);
      },
      error: () => {
        this.pdfUrl = null;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  limpar(): void {
    this.form.reset({
      status: 'TODAS'
    });
    this.pdfUrl = null;
  }
}
