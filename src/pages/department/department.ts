import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Http, RequestOptions, Response} from "@angular/http";
import { CategoryDetailPage } from '../category_detail/category_detail';
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import 'rxjs/add/operator/map';

const BASE_URL = "https://bluebagbr.com/api";

@Component({
  selector: 'page-department',
  templateUrl: 'department.html'
})
export class DepartmentPage {

  public categories: any[];

  constructor(public navCtrl: NavController, public requestOptions: DefaultRequestOptionsProvider, public http: Http) {

  }

  ngOnInit() {
    this.getDepartments()
  }

  /**
   * Get all departments.
   *
   * @returns {Subscription}
   */
  public getDepartments() {
    return this.http
        .get(`${BASE_URL}/departments`, this.requestOptions.merge(new RequestOptions))
        .map((response:Response) => response.json())
        .subscribe(response => {
          this.categories = response.data
        });
  }

  /**
   * Navigate to the Products Page of a given Category.
   *
   * @param category
   * @param categoryIcon
   */
  goToProductsPage(category: string, categoryIcon: string) {
    this.navCtrl.push(CategoryDetailPage, {
      catName: category,
      catIcon: categoryIcon
    });
  }
}
