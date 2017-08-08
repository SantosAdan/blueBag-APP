import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { JwtHelper } from "angular2-jwt";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { StorageProvider } from "../../providers/storage/storage";
import { TabsPage } from "../../pages/tabs/tabs";
import { SignUpPage } from "../sign-up/sign-up";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private BASE_URL = "http://dev.bluebag.com.br/api";
  // private BASE_URL = "http://615cd408.ngrok.io/api";
  public user_email: string;
  public user_password: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private http: Http,
              private storageProvider: StorageProvider) {
    let token = localStorage.getItem('token');

    if (token != null ) {
      this.goToTabsPage();
    }
  }

  /**
   *   Redirect method after login
   */
  goToTabsPage() {
    this.navCtrl.push(TabsPage);
  }

  goToSignUpPage() {
    this.navCtrl.push(SignUpPage);
  }

  /**
   * Alert invalid credentials error method.
   */
  alertConnetionError() {
    let alert = this.alertCtrl.create({
      title: 'Erro!',
      subTitle: 'Usuário ou senha inválidos!',
      buttons: ['OK']
    });

    alert.present();
  }

  /**
   * Extracting data.
   *
   * @param res
   * @returns {any|{}}
   */
  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  /**
   * Handling errors.
   *
   * @param error
   * @returns {ErrorObservable}
   */
  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  /**
   *
   */
  login(user_email, user_password) {
    if (user_email == '' || user_password == '') {
      this.alertConnetionError();
      return;
    }

    let loading = this.loadingCtrl.create({
      content: 'Conectando...'
    });

    // Show loading loader
    loading.present();

    // Prepare body request
    let body = {
      "email": user_email,
      "password": user_password
    };

    // Prepare header request
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers});

    // Make the request call
    this.http.post(this.BASE_URL+'/login', body, options)
        .map(this.extractData)
        .subscribe(
            data => {
              // Dismiss loading loader
              loading.dismiss();

              // If the user credentials are valid, the current user is redirected to the tabs page.
              if (data && data != 'undefined' && data != 'invalid_credentials') {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_email', user_email);
                this.goToTabsPage();
              }
              else {
                this.alertConnetionError();
              }
            },
            err => {
              // Dismiss loading loader
              loading.dismiss();

              let error = err.json().error;

              if (error == 'invalid_credentials') {
                this.alertConnetionError();
              }
            }
        );
  }

}
