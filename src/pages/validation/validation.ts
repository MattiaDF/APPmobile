import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {AuthProvider} from '../../providers/auth/auth'
import {UserProvider} from "../../providers/user/user";

import {User} from "../../models/user"

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
        private sAuth: AuthProvider,
        private sUser: UserProvider,
    ) {
        this.phone = navParams.get('phone');
        this.code = ""+navParams.get('code');
        console.log(this.code, this.phone);
        
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ValidationPage');
    }

    register() {
        this._validate().then(() => {
            const loading = this.loadingCtrl.create({content: "caricamento..."});
            loading.present();
            this.sAuth.signup(this.phone, this.code).then((user) => {
                //save user in storage
                this.sUser.save(new User(user)).then( () => {
                    this.sUser.get().then( user => {
                        console.log(user);
                    })
                    
                })
                loading.dismiss().then(() => {
                    this.navCtrl.setRoot('HomePage');
                })
            })

        }).catch((error) => {console.log(error)});

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

}
