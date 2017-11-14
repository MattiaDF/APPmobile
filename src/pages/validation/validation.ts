import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {AndroidPermissions} from '@ionic-native/android-permissions';

//my providers
import {AuthProvider} from '../../providers/auth/auth'
import {UserProvider} from '../../providers/user/user'
import {ContactProvider} from '../../providers/contact/contact'
import {ChatProvider} from '../../providers/chat/chat'

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
        private sContact: ContactProvider,
        private sChat: ChatProvider,
        private androidPermissions: AndroidPermissions
    ) {
        this.phone = navParams.get('phone');
        this.code = "" + navParams.get('code');
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
                this.initializaAll(user).then(() => {
                    loading.dismiss().then(() => {
                        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.RECORD_AUDIO,
                        this.androidPermissions.PERMISSION.CAPTURE_VIDEO_OUTPUT, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE]).then(() => {
                            this.navCtrl.setRoot('HomePage');
                        })
                    });
                }).catch((error) => console.log('error inizializzazione', error));
            }).catch(() => {console.log('errore signup')});
        }).catch((error) => {console.log(error, 'errore validazione')});

    }

    initializaAll(user: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.sContact.saveSingleContact(user).then(() => {
                this.sUser.save(user).then(() => {
                    this.sContact.saveContacts().then(() => {
                        this.sChat.remoteChats().then(() => {
                            resolve();
                        })
                    }).catch(() => {
                        reject('error in save contacts');
                    });
                }).catch(() => {
                    reject('error in save user in storage');
                });
            })
        });
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
