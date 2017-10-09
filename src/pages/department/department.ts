import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Http, RequestOptions, Response} from "@angular/http";
import {CategoryDetailPage} from "../category_detail/category_detail";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import "rxjs/add/operator/map";
import {JwtProvider} from "../../providers/jwt/jwt";
import {ConfigProvider} from "../../providers/config/config";


@Component({
    selector: 'page-department',
    templateUrl: 'department.html'
})
export class DepartmentPage {

    public departments: any[];
    public showLoading: boolean;

    constructor(public navCtrl: NavController,
                public requestOptions: DefaultRequestOptionsProvider,
                public http: Http,
                private jwtProvider: JwtProvider,
                public configProvider: ConfigProvider) {
    }

    ngOnInit() {
        this.showLoading = true;
    }

    ionViewDidLoad() {
        this.getDepartments()
    }

    /**
     * Get all departments.
     *
     * @returns {Subscription}
     */
    public getDepartments(refresher = null) {
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
                        this.http.post(`${this.configProvider.base_url}/refresh_token`, {}, this.requestOptions.merge(new RequestOptions))
                            .map((response: Response) => response.json())
                            .subscribe(response => {
                                // Setando novo token
                                this.jwtProvider.token = response.token;

                                // Refazendo o request
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
    public goToProductsPage(categoryName: string, categoryIcon: string, categoryId: number) {
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
    public refresh(refresher) {
        this.getDepartments(refresher);
    }
}
