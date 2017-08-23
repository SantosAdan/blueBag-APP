import { Injectable } from '@angular/core';
import {JwtProvider} from "../jwt/jwt";
import {DefaultRequestOptionsProvider} from "../default-request-options/default-request-options";
import {RequestOptions, Response, Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs";

const BASE_URL = "https://bluebagbr.com/api";

@Injectable()
export class AuthProvider {

  constructor(public http: Http, private jwtProvider: JwtProvider, private requestOptions: DefaultRequestOptionsProvider) {

  }

  /**
   * Check if the user is authenticated by looking for his JWTToken
   *
   * @returns {boolean}
   */
  public check() {
    return this.jwtProvider.token != null;
  }

  public getUser() {
    return this.http
        .get(`${BASE_URL}/users`, this.requestOptions.merge(new RequestOptions))
        .map((res:Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server Error.'));
  }
}
