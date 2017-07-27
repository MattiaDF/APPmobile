import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the NomeGruppoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-nome-gruppo',
    templateUrl: 'nome-gruppo.html',
})
export class NomeGruppoPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NomeGruppoPage');
    }

    navToChatPage() {
        this.navCtrl.push("ChatPage");
    }

}
