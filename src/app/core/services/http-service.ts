import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export abstract class HttpService {
  protected readonly URL = environment.apiUrl;
  protected readonly _http = inject(HttpClient);
}
