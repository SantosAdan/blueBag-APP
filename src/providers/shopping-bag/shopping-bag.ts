import { Injectable } from '@angular/core';
import {StorageProvider} from "../storage/storage";

const BAG_KEY = 'shopping_bag';

@Injectable()
export class ShoppingBagProvider {

  public bag: any[];

  constructor(public storageProvider: StorageProvider) {

  }

  public add(product_id: string, amount: number) {
    this.bag.push([product_id => amount]);
    this.storageProvider.setObject(BAG_KEY, this.bag);
  }

}
