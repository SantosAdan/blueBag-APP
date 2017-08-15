import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {LoginPage} from "../login/login";
import {Http, Headers, RequestOptions, Response} from "@angular/http";

const BASE_URL = "http://b499abf0.ngrok.io/api";

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  public user: {
    name: string;
    email: string;
    password: string;
  };

  public address: {
    street: string;
    number: number;
    district: string;
    city: string;
    state: string;
  };

  public searchInput: string = '';
  public citiesList: any;
  public showSearch: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
  }

  ngOnInit() {
    this.user = {name: '', email: '', password: ''};
    this.address = {street: '', number: null, district: '', city: '', state: ''};
    this.showSearch = true;
  }

  /**
   * Return to Login Page.
   */
  goToLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  getCities() {

    if (this.searchInput == '') {
      this.citiesList = [];
      return;
    }

    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers});

    this.http
        .get(`${BASE_URL}/cities`, options)
        .map((res:Response) => res.json())
        .subscribe(res => {
          this.citiesList = res.data;
        });
  }

  setCity(city) {
    this.showSearch = false;

    this.address.city = city.name;
    this.address.state = city.state;
  }

  /**
   * SignUp a user with given credendtials.
   */
  signUp() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers});

    let body = {
      "name": this.user.name,
      "email": this.user.email,
      "password": this.user.password
    };

    this.http
        .post(`${BASE_URL}/users`, body, options)
        .map((res:Response) => res.json())
        .subscribe(res => {
          this.goToLoginPage();
        });
  }
}
