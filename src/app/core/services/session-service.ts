import { computed, effect, Injectable, signal } from '@angular/core';
import { Usuario } from '@/core/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly STORAGE_KEY = 'user_session_token';

  private _token = signal<string | null>(localStorage.getItem(this.STORAGE_KEY));
  public token = this._token.asReadonly();

  public hasActiveSession = computed(() => !!this._token());

  private _perfil = signal<Usuario | null>(null);
  public perfil = this._perfil.asReadonly();

  constructor() {
    effect(() => {
      const currentToken = this._token();
      if (currentToken) {
        localStorage.setItem(this.STORAGE_KEY, currentToken);
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
        this._perfil.set(null);
      }
    });
  }

  updatePerfil(value: Usuario): void {
    this._perfil.set(value);
  }

  createSession(token: string): void {
    this._token.set(token);
  }

  clearSession(): void {
    this._token.set(null);
    this._perfil.set(null);
  }
}
