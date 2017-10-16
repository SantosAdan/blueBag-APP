import { Injectable } from '@angular/core';
import {JwtProvider} from "../jwt/jwt";
import {DefaultRequestOptionsProvider} from "../default-request-options/default-request-options";
import {RequestOptions, Response, Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs";
import {ConfigProvider} from "../config/config";


@Injectable()
export class AuthProvider {

  constructor(
      public http: Http,
      private jwtProvider: JwtProvider,
      private requestOptions: DefaultRequestOptionsProvider,
      private configProvider : ConfigProvider) {
  }

  /**
   * Check if the user is authenticated by looking for his JWTToken
   *
   * @returns {boolean}
   */
  public check() {
    return this.jwtProvider.token != null;
  }

  /**
   * Get logged user based on jwt token.
   *
   * @returns {Observable<R|T>}
   */
  public getUser() {
    return this.http
        .get(`${this.configProvider.base_url}/users?include=addresses`, this.requestOptions.merge(new RequestOptions))
        .map((res:Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server Error.'));
  }

  /**
   * Update user info.
   *
   * @param user
   * @returns {Observable<R|T>}
   */
  public editUser(user) {
    let body = {
      name: user.name,
      email: user.email,
      cpf: user.cpf.substring(0, 11),
      phone: user.phone.substring(0, 11)
    };

    return this.http
        .put(`${this.configProvider.base_url}/users/${user.id}`, body, this.requestOptions.merge(new RequestOptions))
        .map((res:Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server Error.'));
  }
}
