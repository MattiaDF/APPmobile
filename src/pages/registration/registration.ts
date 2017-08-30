import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {AuthProvider} from '../../providers/auth/auth';

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
        public sAuth: AuthProvider
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RegistrationPage');
    }

    toValidation() {
        this._validate().then(() => {
            const loading = this.loadingCtrl.create({content: "Ti stiamo inviando un sms con il codice di attivazione!"});
            loading.present();
            this.sAuth.askCode(this.phone)
                .then((code) => {
                    loading.dismiss().then(() => {
                        this.navCtrl.push('ValidationPage', {phone: this.phone, code: code});
                    })
                }).catch(error => {
                    this.alertCtrl.create({
                        title: "QuickChat",
                        message: 'Errore connessione ',
                        buttons: ["OK"]
                    }).present();
                })

        }).catch(() => {});

    }

    private _validate(): Promise<any> {
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

}
