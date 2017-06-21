import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';

/**
 * Generated class for the RegistrationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-registration',
    templateUrl: 'registration.html',
})
export class RegistrationPage {

    phone: string = "";

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RegistrationPage');
    }

    toValidation() {
        this._validate().then(() => {
            const loading = this.loadingCtrl.create({content: "Ti stiamo inviando un sms con il codice di attivazione!"});
            loading.present();
            this.getCode().then((code) => {
                loading.dismiss().then(() => {
                    console.log('code: ' + code)
                    this.navCtrl.push('ValidationPage',{phone: this.phone, code: code});
                })
            })
            
        }).catch(() => {});

    }

    private _validate():Promise<any> {
        return new Promise((resolve, reject) => {
            let msg = "";
            if (this.phone.trim() === "") {
                msg = "Inserire un numero di telefono";
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

    private getCode():Promise<{ code: string}> {
        return new Promise((resolve, reject) => {
            setTimeout( () => {
                resolve("12345");
            }, 2000);
        });
    }

}
