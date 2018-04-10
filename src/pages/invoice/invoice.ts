import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {Http, RequestOptions, Response} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import {InvoiceDetailsPage} from "../invoice-details/invoice-details";
import * as _ from 'lodash';
import {DepartmentPage} from "../department/department";

@Component({
  selector: 'page-invoice',
  templateUrl: 'invoice.html',
})
export class InvoicePage {

  public user_id: number = null;
  public invoices: any[] = [];
  public BRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});
  public brazilianDate = new Intl.DateTimeFormat('pt-BR');
  public showLoader: boolean;

  constructor (public navCtrl: NavController,
               public navParams: NavParams,
               private auth: AuthProvider,
               public http: Http,
               public configProvider: ConfigProvider,
               public defaultRequest: DefaultRequestOptionsProvider) {
  }

  ionViewDidLoad () {
    // Show loader while getting data
    this.showLoader = true;

    this.getUserId();
    setTimeout(() => {
      this.getInvoices();
      this.showLoader = false;
    }, 1000);
  }

  getInvoices () {
    return this.http
      .get(`${this.configProvider.base_url}/invoices?user_id=${this.user_id}`, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
          this.invoices = res.data;
          this.invoices = _.orderBy(this.invoices, 'created_at.date', 'desc');

          this.invoices.map((invoice) => {
            invoice.total = this.BRL.format(invoice.total);
            invoice.created_at = new Date(invoice.created_at.date);
            invoice.created_at = this.brazilianDate.format(invoice.created_at);

          })
        },
        err => {
          console.log(err)
        })
  }

  getUserId () {
    this.auth.getUser().subscribe(
      res => {
        //noinspection TypeScriptUnresolvedVariable
        this.user_id = res.data.id;
      },
      err => {
        console.log(err);
      }
    );
  }

  goToDetails (invoice_id) {
    this.navCtrl.push(InvoiceDetailsPage, {
      id: invoice_id
    })
  }

  goToDepartmentsPage () {
    this.navCtrl.setRoot(DepartmentPage);
    this.navCtrl.popToRoot();
  }
}
