import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/map';

@Injectable()
export class StorageProvider {

  constructor(private storage: Storage) {

  }

  set(key: string, value: string) {
    window.localStorage[key] = value;
    return this;
  }

  get(key: string, defaultValue = null) {
    return window.localStorage[key] || defaultValue;
  }

  setObject(key: string, value: string) {

  }

  getObject(key: string, value: string) {

  }

  remove(key: string) {
    this.storage.remove(key);
  }
}
