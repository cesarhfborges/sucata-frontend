import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpService {

  public login(data: { email: string; password: string; remember?: boolean }): Observable<any> {
    return this._http.post(`${this.URL}/api/login`, data);
  }
}
