import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Http, RequestOptions, Response} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";


@Component({
  selector: 'page-invoice-details',
  templateUrl: 'invoice-details.html',
})
export class InvoiceDetailsPage {

  public invoice: any;
  public address: any;
  public products: any;
  public created_hour: string;
  public BRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});

  constructor (public navCtrl: NavController,
               public navParams: NavParams,
               public http: Http,
               public configProvider: ConfigProvider,
               public defaultRequest: DefaultRequestOptionsProvider) {
  }

  ionViewDidEnter () {
    let id = this.navParams.get('id');
    this.getInvoiceData(id);
  }

  getInvoiceData (id) {
    return this.http
      .get(`${this.configProvider.base_url}/invoices/${id}`, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
          this.invoice = res.data;

          this.invoice.total = this.BRL.format(this.invoice.total);
          this.invoice.created_at = new Date(this.invoice.created_at.date);
          this.created_hour = this.formatHour(this.invoice);
          this.invoice.created_at = this.formatDate(this.invoice);

          this.address = res.data.address.data;
          this.address.zipcode = this.formatZipcode(this.address.zipcode, '#####-###');

          this.products = res.data.products.data;
          this.products.map((product) => {
            product.value = product.invoice_price;
            product.amount = product.invoice_amount;
          });
        },
        err => {
          console.log(err)
        })
  }

  formatZipcode (value, pattern) {
    let i = 0,
      v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
  }

  formatDate(invoice) {
    return `${invoice.created_at.getDay()}/${invoice.created_at.getMonth()}/${invoice.created_at.getFullYear()}`;
  }

  formatHour(invoice) {
    return `${invoice.created_at.getHours()}:${invoice.created_at.getMinutes()}`;
  }
}
