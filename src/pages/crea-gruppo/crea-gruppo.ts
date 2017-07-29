import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CreaGruppoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-crea-gruppo',
  templateUrl: 'crea-gruppo.html',
})
export class CreaGruppoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreaGruppoPage');
  }

 navToNomeGruppoPage() {
        this.navCtrl.push("NomeGruppoPage");
    }

}
