import {Injectable} from '@angular/core';
import {Http, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {DefaultRequestOptionsProvider} from "../default-request-options/default-request-options";
import {JwtProvider} from "../jwt/jwt";
import {ConfigProvider} from "../config/config";

@Injectable()
export class RefreshTokenProvider {

  constructor (public http: Http,
               public requestOptions: DefaultRequestOptionsProvider,
               private configProvider: ConfigProvider,
               public jwtProvider: JwtProvider) {

  }

  /**
   * Refresh token when it's possible.
   *
   * @returns {Subscription}
   */
  refresh () {
    console.log('Entrei no refresh service!')
    this.http.post(`${this.configProvider.base_url}/refresh_token`, {}, this.requestOptions.merge(new RequestOptions))
      .map((response: Response) => response.json())
      .subscribe(response => {
        console.log(response);
        // Setando novo token
        this.jwtProvider.token = response.token;
      });
  }
}
