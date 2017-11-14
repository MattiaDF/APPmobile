import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {Http, Response} from '@angular/http';
import {StorageProvider} from "../../providers/storage/storage"
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {URL_BASE} from '../../constants';

/**
 * Generated class for the ServerAddressPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-server-address',
    templateUrl: 'server-address.html',
})
export class ServerAddressPage {

//    address: string = '192.168.1.10:8084';
    address: string = '192.168.0.185:8084';
//    address: string = '192.168.43.118:8084';

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private _http: Http,
        private sStorage: StorageProvider
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ServerAddressPage');
    }

    registerAddress() {
        this._validate().then(() => {
            const loading = this.loadingCtrl.create({content: "Verifica connessione in corso..."});
            loading.present();
            this.testAddress().then(() => {
                this.sStorage.saveServerAddress(this.address).then(() => {
                    console.log('ok');
                }).catch(() => {
                    console.log('ko');
                });
                
                loading.dismiss().then(() => {
                    this.navCtrl.push('RegistrationPage');
                })
            }).catch((error) => {
                loading.dismiss().then(() => {
                    this.presentAlert(error);
                })
            })
        }).catch(() => {

        });

    }

    private presentAlert(msg: string) {
        this.alertCtrl.create({
            title: "QuickChat",
            message: msg,
            buttons: ["OK"]
        }).present();
    }

    private _validate(): Promise<any> {
        return new Promise((resolve, reject) => {
            let msg = "";
            if (this.address.trim() === "") {
                msg = "Inserire indirizzo";
            }
            if (msg !== "") {
                this.presentAlert(msg);

                reject();
            } else {
                resolve();
            }
        });
    }

    private testAddress():Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('sono dentro test');
            this._http.get('http://' + this.address + URL_BASE.API + 'test', {})
                .toPromise()
                .then(() => {
                    resolve();
                })
                .catch((err: Response) => reject(`Errore status: ${err.status}`));
        });
    }


}
