import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export abstract class HttpService {
  protected readonly URL = 'http://localhost:8000';
  protected readonly _http = inject(HttpClient);
}
