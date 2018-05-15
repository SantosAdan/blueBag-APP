import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {ConfigProvider} from "../../providers/config/config";
import {Http, Response, RequestOptions} from "@angular/http";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";
import {RefreshTokenProvider} from "../../providers/refresh-token/refresh-token";
import {AuthProvider} from "../../providers/auth/auth";
import * as _ from 'lodash';

@Component({
  selector: 'page-open-case',
  templateUrl: 'open-case.html',
})
export class OpenCasePage {

  public client: any;
  public existingInvoice: string;
  public page: number;
  public subject: string = '';
  public comment: string = '';
  public selectedInvoice: string = '';

  public user_id: number = null;
  public invoices: any[] = [];
  public BRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public http: Http,
              private auth: AuthProvider,
              public configProvider: ConfigProvider,
              public defaultRequest: DefaultRequestOptionsProvider,
              public refreshJWTProvider: RefreshTokenProvider) {
  }

  ionViewDidEnter() {
    this.page = 0;
    this.getUserId();
    this.getClient();
  }

  getClient () {
    return this.http
      .get(`${this.configProvider.base_url}/client`, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
          this.client = res;

        },
        err => {
          if (err.status === 401) {
            // Refresh token
            this.refreshJWTProvider.refresh();

            // Redo request
            this.http
              .get(`${this.configProvider.base_url}/client`, this.defaultRequest.merge(new RequestOptions))
              .map((res: Response) => res.json())
              .subscribe(res => {

                this.client = res.data;

              });
          }
        })
  }

  getInvoices () {
    return this.http
      .get(`${this.configProvider.base_url}/invoices`, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {
          this.invoices = res.data;
          this.invoices = _.orderBy(this.invoices, 'created_at.date', 'desc');

          this.invoices.map((invoice) => {
            invoice.total = this.BRL.format(invoice.total);
            invoice.created_at = new Date(invoice.created_at.date);
            invoice.created_at = `${invoice.created_at.getDate()}/${invoice.created_at.getMonth()+1}/${invoice.created_at.getFullYear()}`;

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

  next () {
    if (this.existingInvoice != undefined) {
      this.page = this.existingInvoice === 'true' ? 1 : 2;
    }
  }

  submitNo () {

    let body = {
      subject: this.subject,
      comment: this.comment
    };

    this.http
      .post(`${this.configProvider.base_url}/contact/new`, body, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {

          this.presentToast('Email enviado com sucesso. Responderemos em breve!', 'success');
          this.close();
        },
        err => {
          if (err.status === 401) {
            // Refresh token
            this.refreshJWTProvider.refresh();

            // Redo request
            this.http
              .get(`${this.configProvider.base_url}/contact/new`, this.defaultRequest.merge(new RequestOptions))
              .map((res: Response) => res.json())
              .subscribe(res => {

                  this.presentToast('Email enviado com sucesso. Responderemos em breve!', 'success');
                  this.close();
              });
          }
        });
  }

  submitYes () {

    let body = {
      id: this.selectedInvoice,
      subject: this.subject,
      comment: this.comment
    };

    this.http
      .post(`${this.configProvider.base_url}/contact/invoice`, body, this.defaultRequest.merge(new RequestOptions))
      .map((res: Response) => res.json())
      .subscribe(res => {

            this.presentToast('Email enviado com sucesso. Responderemos em breve!', 'success');
            this.close();
        },
        err => {
          if (err.status === 401) {
            // Refresh token
            this.refreshJWTProvider.refresh();

            // Redo request
            this.http
              .get(`${this.configProvider.base_url}/contact/invoice`, this.defaultRequest.merge(new RequestOptions))
              .map((res: Response) => res.json())
              .subscribe(res => {

                  this.presentToast('Email enviado com sucesso. Responderemos em breve!', 'success');
                  this.close();
              });
          }
        });

  }

  goToPage3 () {
    this.page = 3;
    this.getInvoices();
  }

  close () {
    this.navCtrl.pop();
  }

  /**
   * Show toast message.
   *
   * @param message
   * @param type
   */
  presentToast (message: string, type: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      cssClass: type
    });
    toast.present();
  }
}
