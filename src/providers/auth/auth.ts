import { Injectable } from '@angular/core';
import {JwtProvider} from "../jwt/jwt";

@Injectable()
export class AuthProvider {

  constructor(private jwtProvider: JwtProvider) {

  }

  /**
   * Check if the user is authenticated by looking for his JWTToken
   *
   * @returns {boolean}
   */
  public check() {
    console.log(this.jwtProvider.token);
    return this.jwtProvider.token != null;
  }

}
