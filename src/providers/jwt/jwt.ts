import { Injectable } from '@angular/core';
import { StorageProvider } from '../storage/storage';

const TOKEN_KEY = 'token';

@Injectable()
export class JwtProvider {

  constructor(private localStorage: StorageProvider) {

  }

  /**
   * Getter
   *
   * @returns {string}
   */
  get token() {
    return this.localStorage.get(TOKEN_KEY);
  }

  /**
   * Setter
   *
   * @param value
   */
  set token(value) {
    value ? this.localStorage.set(TOKEN_KEY, value) : this.localStorage.remove(TOKEN_KEY);
  }
}
