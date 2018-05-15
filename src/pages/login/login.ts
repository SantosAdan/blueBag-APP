import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
// import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { TabsPage } from "../../pages/tabs/tabs";
import { SignUpPage } from "../sign-up/sign-up";
import {JwtProvider} from "../../providers/jwt/jwt";
import {ConfigProvider} from "../../providers/config/config";
import {StorageProvider} from "../../providers/storage/storage";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user_email: string;
  public user_password: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private jwtToken: JwtProvider,
              private storageProvider: StorageProvider,
              private http: Http,
              private configProvider : ConfigProvider) {
    this.user_email = storageProvider.get('user_email') ? storageProvider.get('user_email') : '';
  }

  /**
   *   Redirect method after login.
   */
  goToTabsPage() {
    this.navCtrl.setRoot(TabsPage);
    this.navCtrl.popToRoot();
  }

  /**
   *   Redirect method to SignUp Page.
   */
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
   *
  private handleError(error: any): ErrorObservable {
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }*/

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
    this.http.post(`${this.configProvider.base_url}/login`, body, options)
        .map(this.extractData)
        .subscribe(
            data => {
              console.log(data);
              // Dismiss loading loader
              loading.dismiss();

              // If the user credentials are valid, the current user is redirected to the tabs page.
              if (data && data != 'undefined' && data != 'invalid_credentials') {
                this.jwtToken.token = data.token;
                this.storageProvider.set('user_email', user_email);
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

  presentEmailAlert() {
    let alert = this.alertCtrl.create({
      title: 'Restaurar senha?',
      inputs: [
        {
          name: 'email',
          placeholder: 'E-mail de cadastro'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked')
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            this.requestPasswordReset(data.email)
            console.log(data.email)
          }
        }
      ]
    });

    alert.present();
  }

  requestPasswordReset(email: string) {
    // Prepare header request
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers});

    this.http.get(`${this.configProvider.base_url}/reset_password?email=${email}`, options)
        .map(this.extractData)
        .subscribe(
            data => {
              console.log(data)

              let alert = this.alertCtrl.create({
                title: 'Olá!',
                subTitle: 'Um email foi enviado com a sua solicitação.',
                buttons: ['OK']
              });

              alert.present()
            },
            err => {
              let error = err.json().error
              console.log(error)

              let alert = this.alertCtrl.create({
                title: 'Ops!',
                subTitle: 'Desculpa, mas não encontramos esse email em nosso sistema. Tem certeza que digitou o email correto?',
                buttons: ['Fechar']
              });

              alert.present();
            }
        );
  }

}
