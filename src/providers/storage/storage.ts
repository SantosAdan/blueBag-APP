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

  setObject(key: string, value: any[]) {
    localStorage.setItem(key, JSON.stringify(value));
    return this;
  }

  getObject(key: string, defaultValue = []) {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
