import {Component, NgModule} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import {MaskDirective} from "../../directives/mask/mask";

@Component({
  selector: 'page-user-data',
  templateUrl: 'user-data.html',
})
export class UserDataPage {

  public user: {
    id: number,
    name: string,
    email: string,
    cpf: number,
    phone: number
  };

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public auth: AuthProvider,
      public toastCtrl: ToastController) {
      this.user = {id: null, name: '', email: '', cpf: null, phone: null};
  }

  ionViewDidLoad() {
    this.auth.getUser().subscribe(
        res => {
          //noinspection TypeScriptUnresolvedVariable
          this.user = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            cpf: res.data.cpf,
            phone: res.data.phone
          };
        },
        err => {
          console.log(err);
        }
    );
  }

  public editUserData() {
    let toast = this.toastCtrl.create({
      message: 'Dados alterados com sucesso!',
      duration: 1500,
      position: 'top',
      cssClass: 'success'
    });

    this.auth.editUser(this.user).subscribe(
        res => {
          toast.present();
        },
        err => {
          console.log(err);
        }
    );
  }

}
