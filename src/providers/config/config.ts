import {Injectable} from '@angular/core';

@Injectable()
export class ConfigProvider {

  public BASE_URL = "http://dev.bluebag.com.br/api";
  // public BASE_URL = "http://bluebag.com.br/api";

  constructor () {
  }

  get base_url () {
    return this.BASE_URL;
  }

}
