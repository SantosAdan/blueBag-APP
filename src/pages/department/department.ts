import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Http, RequestOptions, Response} from "@angular/http";
import {CategoryDetailPage} from "../category_detail/category_detail";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import "rxjs/add/operator/map";
import {ConfigProvider} from "../../providers/config/config";
import {StorageProvider} from "../../providers/storage/storage";
import {RefreshTokenProvider} from "../../providers/refresh-token/refresh-token";

const VIEW_MODE: string = 'bluebag_depart_view';

@Component({
  selector: 'page-department',
  templateUrl: 'department.html',
})
export class DepartmentPage {

  public departments: any[];
  public showLoading: boolean;
  public showInList: boolean = true;

  constructor (public navCtrl: NavController,
               public requestOptions: DefaultRequestOptionsProvider,
               public http: Http,
               public configProvider: ConfigProvider,
               private refreshJWTProvider: RefreshTokenProvider,
               private storageProvider: StorageProvider) {
  }

  ionViewDidLoad () {
    this.showLoading = true;
    this.showInList = this.storageProvider.get(VIEW_MODE, 'list') == 'list';

    this.getDepartments()
  }

  /**
   * Get all departments.
   *
   * @returns {Subscription}
   */
  getDepartments (refresher = null) {
    return this.http
      .get(`${this.configProvider.base_url}/departments`, this.requestOptions.merge(new RequestOptions))
      .map((response: Response) => response.json())
      .subscribe(
        response => {
          this.departments = response.data;
          this.showLoading = false; // Retiramos o spinner de loading

          if (refresher) {
            refresher.complete();
          }
        },
        err => {
          if (err.status === 401) {
            // Refresh token
            this.refreshJWTProvider.refresh();

            // Redo request
            this.http
              .get(`${this.configProvider.base_url}/departments`, this.requestOptions.merge(new RequestOptions))
              .map((response: Response) => response.json())
              .subscribe(response => {
                this.departments = response.data;
                this.showLoading = false; // Retiramos o spinner de loading

                if (refresher) {
                  refresher.complete();
                }
              });
          }
        }
      );
  }

  /**
   * Navigate to the Products Page of a given Category.
   *
   * @param categoryName
   * @param categoryIcon
   * @param categoryId
   */
  goToProductsPage (categoryName: string, categoryIcon: string, categoryId: number) {
    this.navCtrl.push(CategoryDetailPage, {
      catName: categoryName,
      catIcon: categoryIcon,
      catId: categoryId
    });
  }

  /**
   * Refresh listener.
   *
   * @param refresher
   */
  refresh (refresher) {
    this.getDepartments(refresher);
  }

  changeViewMode () {
    let mode: string;
    this.showInList = !this.showInList;

    // Save preference to storage
    mode = this.showInList == true ? 'list' : 'cards';
    this.storageProvider.set(VIEW_MODE, mode);
  }
}
