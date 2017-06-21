import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';

/**
 * Generated class for the ValidationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-validation',
    templateUrl: 'validation.html',
})
export class ValidationPage {

    phone: string;
    code: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
    ) {
        this.phone = navParams.get('phone');;
        this.code = navParams.get('code');;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ValidationPage');
    }

    register() {
        this._validate().then(() => {
            const loading = this.loadingCtrl.create({content: "caricamento..."});
            loading.present();
            this.signup().then(() => {
                loading.dismiss().then(() => {
                    this.navCtrl.setRoot('HomePage');
                })
            })

        }).catch(() => {});

    }

    private _validate(): Promise<any> {
        return new Promise((resolve, reject) => {
            let msg = "";
            if (this.code.trim() === "") {
                msg = "Inserire codice valido";
            }
            if (msg !== "") {
                this.alertCtrl.create({
                    title: "QuickChat",
                    message: msg,
                    buttons: ["OK"]
                }).present();

                reject();
            } else {
                resolve();
            }
        });
    }

    private signup() {
        return new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, 2000);
});
    }

}
