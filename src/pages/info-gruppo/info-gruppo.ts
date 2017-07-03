import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the InfoGruppoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-info-gruppo',
    templateUrl: 'info-gruppo.html',
})
export class InfoGruppoPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InfoGruppoPage');
    }

    navToInfoContatto() {
        this.navCtrl.push("InfoContattoPage");
    }

}
