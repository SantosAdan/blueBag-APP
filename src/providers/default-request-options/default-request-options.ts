import { Injectable } from '@angular/core';
import {RequestOptions, RequestOptionsArgs, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {JwtProvider} from "../jwt/jwt";


@Injectable()
export class DefaultRequestOptionsProvider extends RequestOptions {

  constructor(private jwtProvider: JwtProvider) {
    super();
  }

  merge(options?: RequestOptionsArgs): RequestOptions {
    let headers = options.headers || new Headers();
    headers.set('Authorization', `Bearer ${this.jwtProvider.token}`);
    headers.set('Content-Type', 'application/json');
    options.headers = headers;

    return super.merge(options);
  }

}
