import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController} from 'ionic-angular';

/**
 * Generated class for the PopOverHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-pop-over-home',
    templateUrl: 'pop-over-home.html',
})
export class PopOverHomePage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PopOverHomePage');
    }

    toNewChatrooms() {
        this.viewCtrl.dismiss();
        let modal = this.modalCtrl.create("CreaGruppoPage");
        modal.present();
        //      this.navCtrl.push('CreaGruppoPage');
        modal.onDidDismiss(() => {
            this.viewCtrl.dismiss();
        })

    }

    toProfilo() {
//        this.viewCtrl.dismiss();
        this.navCtrl.push('ImpUtentePage');
    }

}
