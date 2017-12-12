import {Component} from "@angular/core";
import {ActionSheetController, AlertController, ModalController, NavController, ToastController} from "ionic-angular";
import {AuthProvider} from "../../providers/auth/auth";
import {orderBy, reject, remove} from "lodash";
import {AddressNewPage} from "../address-new/address-new";
import {Http, RequestOptions, Response} from "@angular/http";
import {ConfigProvider} from "../../providers/config/config";
import {DefaultRequestOptionsProvider} from "../../providers/default-request-options/default-request-options";

@Component({
    selector: 'page-address',
    templateUrl: 'address.html',
})
export class AddressPage {

    public addresses: any[] = [];
    private userId: string;
    public showLoading: boolean = true;

    constructor(public navCtrl: NavController,
                private auth: AuthProvider,
                public modalCtrl: ModalController,
                public toastCtrl: ToastController,
                public alertCtrl: AlertController,
                public actionSheetCtrl: ActionSheetController,
                private http: Http,
                private configProvider: ConfigProvider,
                private defaultRequest: DefaultRequestOptionsProvider) {
    }

    ionViewDidEnter() {
        this.getAddresses();
    }

    getAddresses() {
        this.auth.getUser().subscribe(
            res => {
                //noinspection TypeScriptUnresolvedVariable
                this.userId = res.data.id;
                //noinspection TypeScriptUnresolvedVariable
                this.addresses = res.data.addresses.data;

                // Ordering
                this.addresses = orderBy(this.addresses, 'street', 'asc');

                // Close loading spinner
                this.showLoading = false;
            },
            err => {
                console.log(err);
            }
        );
    }

    deleteAddress(address_id) {
        this.http
            .delete(`${this.configProvider.base_url}/addresses/${address_id}`, this.defaultRequest.merge(new RequestOptions))
            .map((res: Response) => res.json())
            .subscribe(res => {
                    let removed = remove(this.addresses, {'id': address_id});
                    if (res == null && removed) {
                        this.presentToast('Endereço apagado com sucesso.', 'success');
                    }
                },
                err => {
                    if (err.status == 500) {
                        this.presentToast('Endereço não foi apagado.', 'error');
                    }
                });
    }

    /**
     * Show confirm removing address alert.
     *
     */
    showConfirm(address_id) {
        let alert = this.alertCtrl.create({
            title: '',
            message: 'Deseja apagar este endereço?',
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Sim',
                    handler: () => {
                        this.deleteAddress(address_id);
                    }
                }
            ]
        });

        alert.present();
    }

    /**
     * Show toast message.
     *
     * @param message
     * @param type
     */
    presentToast(message: string, type: string) {
        let toast = this.toastCtrl.create({
            message: message,
            cssClass: type,
            duration: 2000,
            position: 'top',
            dismissOnPageChange: true,
        });

        toast.present();
    }

    /**
     * Show action sheet for address.
     *
     * @param {any} address_id
     */
    presentActionSheet(address_id) {
        let actionSheet = this.actionSheetCtrl.create({
            title: '',
            buttons: [
                {
                    text: 'Remover',
                    icon: 'trash',
                    role: 'destructive',
                    handler: () => {
                        this.showConfirm(address_id);
                    }
                }, {
                    text: 'Editar',
                    icon: 'create',
                    handler: () => {
                        this.presentEditAddressModal(address_id);
                    }
                }
            ]
        });
        actionSheet.present();
    }

    /**
     * Show modal for new address form.
     */
    presentNewAddressModal() {
        const newAddressModal = this.modalCtrl.create(AddressNewPage, {
            user_id: this.userId,
            mode: 'new'
        });
        newAddressModal.onDidDismiss(data => {
            this.updateAddressArray(data);
        });
        newAddressModal.present();
    }

    /**
     * Show modal for new address form.
     */
    presentEditAddressModal(address_id) {
        const editAddressModal = this.modalCtrl.create(AddressNewPage, {
            user_id: this.userId,
            address_id: address_id,
            mode: 'edit'
        });
        editAddressModal.onDidDismiss(data => {
            this.updateAddressArray(data);
        });
        editAddressModal.present();
    }

    /**
     * Update address array to match created/updated values.
     *
     * @param data
     */
    updateAddressArray(data) {
        this.addresses = reject(this.addresses, {id: data.id}); // Removes address from array
        this.addresses.push(data); // Push new/updated value
        this.addresses = orderBy(this.addresses, 'street', 'asc'); // Ordering
    }
}
