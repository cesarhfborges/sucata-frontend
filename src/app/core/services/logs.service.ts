import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@/core/services/http-service';

export interface LogFile {
  file: string;
  date: string;
  size_kb: number;
  last_modified: string;
}

export interface LogEntry {
  timestamp: string;
  environment: string;
  level: string;
  message: string;
  body: string | null;
}

export interface LogResponse {
  file: string;
  entries: LogEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class LogsService extends HttpService {
  public listarArquivos(): Observable<LogFile[]> {
    return this._http.get<LogFile[]>(`${this.URL}/api/logs`);
  }

  public obterPorData(date: string): Observable<LogResponse> {
    return this._http.get<LogResponse>(`${this.URL}/api/logs/${date}`);
  }

  public status(): Observable<any> {
    return this._http.get<any>(`${this.URL}/api/health`);
  }
}
