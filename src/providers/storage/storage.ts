import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class StorageProvider {

  constructor() {

  }

  set(key: string, value: string) {
    localStorage.setItem(key, value);
    return this;
  }

  get(key: string, defaultValue = null) {
    return localStorage.getItem(key) || defaultValue;
  }

  setObject(key: string, value: string) {

  }

  getObject(key: string, value: string) {

  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
