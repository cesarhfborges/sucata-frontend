import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly STORAGE_KEY = 'user_session_token';

  private _token = signal<string | null>(localStorage.getItem(this.STORAGE_KEY));

  public token = this._token.asReadonly();

  public hasActiveSession = computed(() => !!this._token());

  constructor() {
    effect(
      () => {
        const currentToken = this._token();
        if (currentToken) {
          localStorage.setItem(this.STORAGE_KEY, currentToken);
        } else {
          localStorage.removeItem(this.STORAGE_KEY);
        }
      },
      {
        debugName: 'SessionService'
      }
    );
  }

  createSession(token: string): void {
    this._token.set(token);
  }

  clearSession(): void {
    this._token.set(null);
  }
}
